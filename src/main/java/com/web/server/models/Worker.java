package com.web.server.models;

public class Worker extends BaseModel<Worker> {
    private String role;

    public String getRole() {
        return role;
    }

    public Worker setRole(String role) {
        this.role = role;

        return this;
    }
}
