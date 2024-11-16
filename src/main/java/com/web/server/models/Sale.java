package com.web.server.models;

import java.util.Date;

public class Sale {
    private int id;
    private Date date;
    private int productId;
    private int clientId;
    private int amount;

    public int getAmount() {
        return amount;
    }

    public Sale setAmount(int amount) {
        this.amount = amount;

        return this;
    }

    public Date getDate() {
        return date;
    }

    public int getClientId() {
        return clientId;
    }

    public Sale setClientId(int clientId) {
        this.clientId = clientId;

        return this;
    }

    public int getProductId() {
        return productId;
    }

    public int getId() {
        return id;
    }

    public Sale setId(int id) {
        this.id = id;

        return this;
    }

    public Sale setProductId(int productId) {
        this.productId = productId;

        return this;
    }

    public Sale setDate(Date date) {
        this.date = date;

        return this;
    }
}
