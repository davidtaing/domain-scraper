import { resolve } from "node:path";

import connectDb from "./database.js";
import ListingsService from "./listing/listings.service.js";
import { writeToJson, getCurrentDateString } from "./utils.js";

// postcodes for Homebush, Homebush West, North Strathfield, Concord & Concord West
const postCodes = ["2140", "2137", "2138"]
// property Types from the Domain API
const propertyTypes = ["ApartmentUnitFlat", "Duplex", "House", "Townhouse", "SemiDetached", "Studio"];

async function main() {
  await connectDb();

  let promises = [];

  for (const postCode of postCodes) {
    let listings = [];

    for (const propertyType of propertyTypes) {
      const data = await ListingsService.getListings(postCode, propertyType)
      if (data.length > 0)
        listings = listings.concat(data);
    }
    
    const filepath = resolve(`./data/${postCode}_${getCurrentDateString()}.json`);
    promises.concat(writeToJson(listings, filepath));
    promises.concat(ListingsService.saveListingsToDb(listings));
  }

  Promise.resolve(promises)
    .then(() => {
      console.log("Persisted Data to MongoDB & JSON.");
      process.exit(0);
    });
}

main();