import fs, { writeFile } from "node:fs/promises";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Postcodes for Homebush, Homebush West, North Strathfield, Concord & Concord West
const postCodes = ["2140", "2137", "2138"]
// Property Types from the Domain API
const propertyTypes = ["ApartmentUnitFlat", "Duplex", "House", "Townhouse", "SemiDetached", "Studio"];

export const createRequestBody = (postcode, propertyType, pageNumber = 1) => {
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
    "pageSize": 200,
    pageNumber
  }
}

export const makeApiRequest = async (queryBody, apiKey = process.env.DOMAIN_API_KEY) => {
  return await axios({
    method: "POST",
    url: "https://api.domain.com.au/v1/listings/residential/_search",
    data: queryBody,
    headers: {
      "X-Api-Key": apiKey,
    }
  })
}

export const main = async () => {
  // TODO iterate through all suburbs
    // TODO iterate through all property types
      // build request body
      // query api
      // TODO process response headers
      // TODO flatten object a.k.a massage data
      // TODO save to file
      
      // check response headers for x-total-count
        // rerun for any additional pages

  const requestBody = createRequestBody(postCodes[0], propertyTypes[0]);
  const response = await makeApiRequest(requestBody);
  console.log(response);
}

main();