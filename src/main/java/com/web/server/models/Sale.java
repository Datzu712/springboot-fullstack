package com.web.server.models;

import java.util.Date;

public class Sale extends BaseModel<Sale> {
    private Date purchaseDate;
    private int productId;
    private int clientId;
    private int amount;

    public Date getPurchaseDate() {
        return purchaseDate;
    }

    public Sale setPurchaseDate(Date date) {
        this.purchaseDate = date;
        return this;
    }

    public int getProductId() {
        return productId;
    }

    public Sale setProductId(int productId) {
        this.productId = productId;
        return this;
    }

    public int getClientId() {
        return clientId;
    }

    public Sale setClientId(int clientId) {
        this.clientId = clientId;
        return this;
    }

    public int getAmount() {
        return amount;
    }

    public Sale setAmount(int amount) {
        this.amount = amount;
        return this;
    }
}
