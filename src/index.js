import fs from "node:fs/promises";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const pageSize = 200;
// postcodes for Homebush, Homebush West, North Strathfield, Concord & Concord West
const postCodes = ["2140", "2137", "2138"]
// property Types from the Domain API
const propertyTypes = ["ApartmentUnitFlat", "Duplex", "House", "Townhouse", "SemiDetached", "Studio"];

async function main() {
  for (const postCode of postCodes) {
    let listings = [];

    for (const propertyType of propertyTypes) {
      const data = await getListings(postCode, propertyType)
      if (data.length > 0)
        listings = listings.concat(data);
    }

    writeListingsToFile(postCode, listings);
  }
}

export async function getListings(postCode, propertyType, pageNumber = 1) {
  const requestBody = createRequestBody(postCode, propertyType, pageNumber);
  const response = await makeApiRequest(requestBody);

  // early exit if no results are found
  if (response.data.length === 0) return [];
  
  let listings = response.data.map(item => flattenListingData(item));
  
  // recurse if there are additional pages of listings
  if (response.headers["x-total-count"] > pageNumber * pageSize) {
    listings = listings.concat(await getListings(postCode, propertyType, pageNumber + 1));
  }

  return listings;
}

export function createRequestBody(postcode, propertyType, pageNumber = 1) {
  return {
    "listingType": "Rent",
    "propertyTypes": [propertyType],
    "locations": [
      {
        "state": "NSW",
        "region": "",
        "area": "",
        "suburb": "",
        postcode
      }
    ],
    "excludePriceWithheld": false,
    "excludeDepositTaken": false,
    pageSize,
    pageNumber
  }
}

export async function makeApiRequest(queryBody, apiKey = process.env.DOMAIN_API_KEY) {
  return await axios({
    method: "POST",
    url: "https://api.domain.com.au/v1/listings/residential/_search",
    data: queryBody,
    headers: {
      "X-Api-Key": apiKey,
    }
  })
}

/**
 * Flattens listings data to make it easier manipulate in the MongoDB database
 */
export function flattenListingData({ listing }) {
  const { id, priceDetails, propertyDetails, ...otherListingProps } = listing;
  return {
    _id: id,
    ...priceDetails,
    ...propertyDetails,
    ...otherListingProps
  };
}

export async function writeListingsToFile(postCode, listings) {
  try {
    const fileName = `./data/${postCode}.json`;

    fs.writeFile(fileName, JSON.stringify(listings))
      .then(
        () => console.log(`Wrote listings to ${fileName}`)
      );
  } catch (err) {
    console.error(err);
  }
}

main();