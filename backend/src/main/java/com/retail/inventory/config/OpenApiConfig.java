package com.retail.inventory.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI retailInventoryOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Retail Inventory Management System API")
                        .description("Production-grade RESTful API for Retail Inventory, Products, Warehouses, Suppliers, and Orders.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Retail Engineering Team")
                                .email("support@retailinventory.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")));
    }
}
