package com.web.server.repositories;

public interface IRepositoryMethods<K extends Object> {
    K findOneById(int id);
    K[] findAll();
    void deleteOneById(int id);
    void updateOneById(int id, K entity);
    void insertOne(K entity);
}
