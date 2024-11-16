
package com.web.server.repositories;

import com.web.server.models.Client;
import com.web.server.utils.AppLogger;
import com.web.server.database.DatabaseManager;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ClientRepository implements IRepositoryMethods<Client> {
    private Connection connection;

    public ClientRepository() {
        try {  
            this.connection = DatabaseManager.getConnection();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public Client findOneById(int id) {
        String sql = "SELECT * FROM client WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new Client()
                    .setId(rs.getInt("id"))
                    .setName(rs.getString("name"))
                    .setEmail(rs.getString("email"))
                    .setPhone(rs.getString("phone"));
            }
        } catch (SQLException e) {
            AppLogger.error(e.getMessage() + "\nStackTrace:" + e.getStackTrace() + "\nSQLState" + e.getSQLState());
        }
        return null;
    }

    public Client[] findAll() {
        String sql = "SELECT * FROM client";
        List<Client> clients = new ArrayList<>();
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Client client = new Client()
                    .setId(rs.getInt("id"))
                    .setName(rs.getString("name"))
                    .setEmail(rs.getString("email"))
                    .setPhone(rs.getString("phone"));
                clients.add(client);
            }
        } catch (SQLException e) {
            AppLogger.error(e.getMessage() + "\nStackTrace:" + e.getStackTrace() + "\nSQLState" + e.getSQLState());
        }
        return clients.toArray(new Client[0]);
    }

    public void deleteOneById(int id) {
        String sql = "DELETE FROM client WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            AppLogger.error(e.getMessage() + "\nStackTrace:" + e.getStackTrace() + "\nSQLState" + e.getSQLState());
        }
    }

    public void updateOneById(int id, Client entity) {
        String sql = "UPDATE client SET name = ?, email = ?, phone = ? WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, entity.getName());
            pstmt.setString(2, entity.getEmail());
            pstmt.setString(3, entity.getPhone());
            pstmt.setInt(4, id);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            AppLogger.error(e.getMessage() + "\nStackTrace:" + e.getStackTrace() + "\nSQLState" + e.getSQLState());
        }
    }

    public void insertOne(Client entity) {
        String sql = "INSERT INTO client (name, email, phone) VALUES (?, ?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, entity.getName());
            pstmt.setString(2, entity.getEmail());
            pstmt.setString(3, entity.getPhone());
            pstmt.executeUpdate();
        } catch (SQLException e) {
            AppLogger.error(e.getMessage() + "\nStackTrace:" + e.getStackTrace() + "\nSQLState" + e.getSQLState());
        }
    }
}