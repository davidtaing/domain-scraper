library(mongolite)
library(tidyverse)
library(jsonlite)

# Retrieve Property Types
propType_path <- "./propertyFilters.json";
propertyCategories <- read_json(propType_path, simplifyDataFrame=TRUE);
postcodes <- c("2137", "2138", "2140");

# Create Filter
setClass("filter", slots=list(postcode="character", propertyType="character", bedrooms="numeric"))

# Connect to MongoDB
m <- mongo(db = "domain", collection ="listings");

processListings <- function(postcode, propertyType, bedrooms) {
  filter <- data.frame(postcode = postcode, propertyType = propertyType, bedrooms=bedrooms);
  mongoose_query_string <- toJSON(unbox(filter), pretty=TRUE, raw="mongo");
  print(mongoose_query_string);
  # Query DB
  #m$find(mongoose_query_string) %>%
  #    na.omit("displayPrice") -> results
  results <- m$find(mongoose_query_string)
  
  if (nrow(results) > 0) {
    print(str_c("Processing ", nrow(results), " results"))
    # Create Title for Plot & File Path
    title <- str_c(postcode, "_" , propertyType, "_", bedrooms ,"BR_", Sys.Date())
    path <- str_c(title, ".png")
    subtitle <- str_c("(N = ", count(results), ")")
    print(path)
    print(path)
    
    p <- ggplot(results, aes(displayPrice)) + geom_bar(fill = "skyblue4") + labs(x = "Rent Per Week", y = "Property Count", title = title, subtitle = subtitle);
    p
    
    ggsave(path="../plots", filename=path, plot=last_plot())
  } else {
    print("No results found.")
  }
}

for (postcode in postcodes) {
  for (row in 1:nrow(propertyCategories)) {
    propertyType <- propertyCategories[row, "propertyType"]
    bedrooms <-propertyCategories[row, "bedrooms"]
    processListings(postcode, propertyType, bedrooms)
  }
} 
  
