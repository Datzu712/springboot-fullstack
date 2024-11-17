package com.web.server.repositories;

import com.web.server.models.Product;
import com.web.server.utils.AppLogger;
import com.web.server.database.DatabaseManager;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProductRepository implements IRepositoryMethods<Product> {
    private Connection connection;

    public ProductRepository() {
        try {  
            this.connection = DatabaseManager.getConnection();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public Product findOneById(int id) {
        String sql = "SELECT * FROM product WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new Product()
                    .setId(rs.getInt("id"))
                    .setName(rs.getString("name"))
                    .setDescription(rs.getString("description"))
                    .setPrice(rs.getDouble("price"));
            }
        } catch (SQLException e) {
            AppLogger.error(e.getMessage());
        }
        return null;
    }

    public Product[] findAll() {
        String sql = "SELECT * FROM product";
        List<Product> products = new ArrayList<>();
        try (ResultSet rs = connection.createStatement().executeQuery(sql)) {
            while (rs.next()) {
                Product product = new Product()
                    .setId(rs.getInt("id"))
                    .setName(rs.getString("name"))
                    .setDescription(rs.getString("description"))
                    .setPrice(rs.getDouble("price"));
                products.add(product);
            }
        } catch (SQLException e) {
            AppLogger.error(e.getMessage());
        }
        return products.toArray(new Product[0]);
    }

    public void deleteOneById(int id) {
        String sql = "DELETE FROM product WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            AppLogger.error(e.getMessage());
        }
    }

    public void updateOneById(int id, Product entity) {
        String sql = "UPDATE product SET name = ?, description = ?, price = ? WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, entity.getName());
            pstmt.setString(2, entity.getDescription());
            pstmt.setDouble(3, entity.getPrice());
            pstmt.setInt(4, id);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            AppLogger.error(e.getMessage());
        }
    }

    public void insertOne(Product entity) {
        String sql = "INSERT INTO product (name, description, price) VALUES (?, ?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, entity.getName());
            pstmt.setString(2, entity.getDescription());
            pstmt.setDouble(3, entity.getPrice());
            pstmt.executeUpdate();
        } catch (SQLException e) {
            AppLogger.error(e.getMessage());
        }
    }
}