import fs from "node:fs/promises";
import { resolve } from "node:path";
import axios from "axios";

import config from "../config.js";

class ListingsService {
  static async getListings(postCode, propertyType, pageNumber = 1, pageSize = 200) {
    const requestBody = this.createRequestBody(postCode, propertyType, pageNumber);
    const response = await this.makeApiRequest(requestBody);
  
    // early exit if no results are found
    if (response.data.length === 0) return [];
    
    let listings = response.data.map(item => this.flattenListingData(item));
    
    // recurse if there are additional pages of listings
    if (response.headers["x-total-count"] > pageNumber * pageSize) {
      listings = listings.concat(await this.getListings(postCode, propertyType, pageNumber + 1));
    }
  
    return listings;
  }
  
  static createRequestBody(postcode, propertyType, pageNumber = 1, pageSize = 200) {
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
  
  static async makeApiRequest(queryBody, apiKey = config.DOMAIN_API_KEY) {
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
  static flattenListingData({ listing }) {
    const { id, priceDetails, propertyDetails, ...otherListingProps } = listing;
    const price = priceDetails.displayPrice.replace(/[^\d.-]/g, '').split("-");
  
    return {
      _id: id,
      ...priceDetails,
      displayPrice: parseInt(price[0]),
      ...propertyDetails,
      ...otherListingProps
    };
  }
  
  static async writeListingsToFile(postCode, listings) {
    try {
      const fileName = resolve(`./data/${postCode}.json`);
      fs.writeFile(fileName, JSON.stringify(listings))
        .then(
          () => console.log(`Wrote listings to ${fileName}`)
        );
    } catch (err) {
      console.error(err);
    }
  }
}

export default ListingsService;