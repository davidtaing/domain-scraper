library(mongolite)
library(dplyr)
library(ggplot2)

m <- mongo(db = "domain", collection ="listings")

m$find('{"propertyType": "ApartmentUnitFlat", "bedrooms": 1, "postcode": "2140"}') %>% 
  select("displayableAddress", "suburb", "postcode", "displayPrice", "propertyType", "bedrooms", "bathrooms", "carspaces") %>%
    na.omit("displayPrice") -> results

p <- ggplot(results, aes(displayPrice)) + geom_bar(fill = "skyblue4");

p
