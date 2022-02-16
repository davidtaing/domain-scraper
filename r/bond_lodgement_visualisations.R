library(tidyverse)

bond_lodgements_path <- "../data/Rental-bond-lodgements-data-January-2022.xlsx"
bond_period <- "January-2022"
postcodes <- c("2137", "2138", "2140")
dwelling_types <- c("F", "H", "T", "O", "U");

target_plot_root_path <- "../plots/bond_lodgements"

bond_data <- readxl::read_excel(bond_lodgements_path)

for (postcode in postcodes) {
  for (dwelling_type in dwelling_types) {
    bond_data %>% filter(Postcode == postcode) %>% filter(Type == dwelling_type) -> bonds_by_type
    bedrooms <- distinct(as.data.frame(bonds_by_type$Bedrooms));
    
    print(postcode)
    print(dwelling_type)
    print(bedrooms)
    
    for (bedroom_amount in 1:nrow(bedrooms)) {
      print(bedroom_amount)
      
      bonds_by_type %>% filter(Bedrooms == bedroom_amount) -> bonds_by_type_and_bedrooms    
      print(bonds_by_type_and_bedrooms)
      
      if (nrow(bonds_by_type_and_bedrooms) > 0) {
        print(str_c("Processing ", nrow(bonds_by_type_and_bedrooms), " results"))
        
        # Create Title for Plot & File Path
        title <- str_interp("${postcode}_${dwelling_type}_${bedroom_amount}BR_${bond_period}")
        filename <- str_interp("${title}.png")
        subtitle <- str_c("(N = ", count(bonds_by_type_and_bedrooms), ")")
        
        target_plot_path <- target_plot_root_path
        
        print(filename);
        
        p <- ggplot(bonds_by_type_and_bedrooms, aes(Rent)) + 
          geom_bar(fill = "firebrick") + 
          labs(x = "Rent Per Week", y = "Property Count", title = title, subtitle = subtitle) +
          theme(axis.text.x = element_text(angle=90));
        p
        
        ggsave(path=target_plot_path, filename=filename, plot=last_plot(), device = "png")
      }
    }
  }
}
