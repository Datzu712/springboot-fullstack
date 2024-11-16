package com.web.server.models;

// EntidadBase
public abstract class BaseModel<C extends BaseModel<C>> {
    private int id;
    private String name;

    public BaseModel() {}
    public BaseModel(int id, String name) {
        this.name = name;
        this.id = id;
    }

    public int getId() {
        return id;
    }

    @SuppressWarnings("unchecked")
    public C setId(int id) {
        this.id = id;

        return (C) this;
    }

    public String getName() {
        return this.name;
    }

    @SuppressWarnings("unchecked")
    public C setName(String name) {
        this.name = name;

        return (C) this;
    }
}
