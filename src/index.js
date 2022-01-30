import fs from "node:fs/promises";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const pageSize = 200;
// Postcodes for Homebush, Homebush West, North Strathfield, Concord & Concord West
const postCodes = ["2140", "2137", "2138"]
// Property Types from the Domain API
const propertyTypes = ["ApartmentUnitFlat", "Duplex", "House", "Townhouse", "SemiDetached", "Studio"];

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
  
  const data = {
    _id: id,
    ...priceDetails,
    ...propertyDetails,
    ...otherListingProps
  };

  return data;
}

export async function getListings(postCode, propertyType, pageNumber = 1) {
  const requestBody = createRequestBody(postCode, propertyType, pageNumber);
  const response = await makeApiRequest(requestBody);

  // Early exit if no results are found
  if (response.data.length === 0)
    return;
  
  const listings = response.data.map(item => flattenListingData(item));

  try {
    const fileName = `./data/${postCode}_${propertyType}_pg${pageNumber}.json`;
    fs.writeFile(fileName, JSON.stringify(listings)).then(() => console.log(`Wrote listings to ${fileName}`));

    // recurse if there are additional pages of listings
    if (response.headers["x-total-count"] > pageNumber * pageSize) {
      getListings(postCode, propertyType, pageNumber + 1);
    }
  } catch (err) {
    console.error(err);
  }
}

async function main() {
  // iterate through all suburbs
    // iterate through all property types
      // build request body
      // query api
      // flatten object a.k.a massage data
      // save to file
      
      // check response headers for x-total-count
        // rerun for any additional pages

  for (const postCode of postCodes) {
    for (const propertyType of propertyTypes) {
      await getListings(postCode, propertyType);
    }
  }
}

main();