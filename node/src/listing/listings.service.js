import axios from "axios";

import config from "../config.js";
import Listing from "../models/listing.model.js";

class ListingsService {
  static async getListings(postCode, propertyType, pageNumber = 1, pageSize = 200) {
    const requestBody = this.createRequestBody(postCode, propertyType, pageNumber);
    const response = await this.makeApiRequest(requestBody);
  
    // early exit if no results are found
    if (response.data.length === 0) return [];
    
    let listings = response.data
      .map(item => this.selectPropsFromListing(item))
      .map(item => this.flattenListingData(item));
    
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
  
  static async makeApiRequest(queryBody) {
    return await axios({
      method: "POST",
      url: "https://api.domain.com.au/v1/listings/residential/_search",
      data: queryBody,
      headers: {
        "X-Api-Key": config.DOMAIN_API_KEY,
      }
    })
  }
  
  // selects relevant properties from raw listing data
  static selectPropsFromListing({ listing }) {
    const { id, listingType, priceDetails, propertyDetails, dateAvailable, dateListed, listingSlug } = listing

    return {
      id,
      listingType,
      priceDetails,
      propertyDetails,
      dateAvailable,
      dateListed,
      listingSlug
    };
  }

  /**
   * Flattens listings data to make it easier manipulate in the MongoDB database
   */
  static flattenListingData(listing) {
    const { id, priceDetails, propertyDetails, ...otherListingProps } = listing;
    const price = this.cleanDisplayPrice(priceDetails.displayPrice);
  
    return {
      _id: id,
      displayPrice: parseInt(price[0]),
      ...propertyDetails,
      ...otherListingProps
    };
  }

  static async saveListingsToDb(listings) {
    return Listing.insertMany(listings);
  }

  static cleanDisplayPrice(displayPrice) {
    const strings = displayPrice.replace(/[^\d.]/g, ' ').trim().split(/\s+/);

    for (const string of strings) {
      if (string.length >= 3) return string;
    }

    return "";
  }
}

export default ListingsService;