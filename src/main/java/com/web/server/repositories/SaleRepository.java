package com.web.server.repositories;

import com.web.server.models.Sale;
import com.web.server.utils.AppLogger;
import com.web.server.database.DatabaseManager;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SaleRepository implements IRepositoryMethods<Sale> {
    private Connection connection;

    public SaleRepository() {
        try {
            this.connection = DatabaseManager.getConnection();
        } catch (Exception e) {
            AppLogger.error(e.getMessage());
        }
    }

    public Sale findOneById(int id) {
        String sql = "SELECT * FROM sale WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new Sale()
                    .setId(rs.getInt("id"))
                    .setProductId(rs.getInt("product_id"))
                    .setClientId(rs.getInt("client_id"))
                    .setAmount(rs.getInt("amount"))
                    .setPurchaseDate(rs.getDate("purchase_date"));
            }
        } catch (SQLException e) {
            AppLogger.error(e.getMessage());
        }
        return null;
    }

    public Sale[] findAll() {
        String sql = "SELECT * FROM sale";
        List<Sale> sales = new ArrayList<>();
        try (ResultSet rs = connection.createStatement().executeQuery(sql)) {
            while (rs.next()) {
                Sale sale = new Sale()
                    .setId(rs.getInt("id"))
                    .setProductId(rs.getInt("product_id"))
                    .setClientId(rs.getInt("client_id"))
                    .setAmount(rs.getInt("amount"))
                    .setPurchaseDate(rs.getDate("purchase_date"));
                sales.add(sale);
            }
        } catch (SQLException e) {
            AppLogger.error(e.getMessage());
        }
        return sales.toArray(new Sale[0]);
    }

    public void deleteOneById(int id) {
        String sql = "DELETE FROM sale WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            AppLogger.error(e.getMessage());
        }
    }

    public void updateOneById(int id, Sale entity) {
        String sql = "UPDATE sale SET product_id = ?, client_id = ?, amount = ?, purchase_date = ? WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, entity.getProductId());
            pstmt.setInt(2, entity.getClientId());
            pstmt.setInt(3, entity.getAmount());
            pstmt.setDate(4, new Date(entity.getPurchaseDate().getTime()));
            pstmt.setInt(5, id);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            AppLogger.error(e.getMessage());
        }
    }

    public void insertOne(Sale entity) {
        String sql = "INSERT INTO sale (product_id, client_id, amount, purchase_date) VALUES (?, ?, ?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, entity.getProductId());
            pstmt.setInt(2, entity.getClientId());
            pstmt.setInt(3, entity.getAmount());
            pstmt.setDate(4, new Date(entity.getPurchaseDate().getTime()));
            pstmt.executeUpdate();
        } catch (SQLException e) {
            AppLogger.error(e.getMessage());
        }
    }
}