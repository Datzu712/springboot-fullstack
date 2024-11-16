package com.web.server.models;

public class Client extends BaseModel<Client> {
    private String email;
    private String phone;

    public String getEmail() {
        return email;
    }

    public Client setEmail(String email) {
        this.email = email;

        return this;
    }

    public String getPhone() {
        return phone;
    }

    public Client setPhone(String phone) {
        this.phone = phone;

        return this;
    }
}
