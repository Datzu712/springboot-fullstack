package com.web.server.models;

public class Product extends BaseModel<Product> {
    private String description;
    private double price;

    public String getDescription() {
        return description;
    }

    public Product setDescription(String description) {
        this.description = description;

        return this;
    }

    public double getPrice() {
        return price;
    }

    public Product setPrice(double price) {
        this.price = price;

        return this;
    }
    
}
