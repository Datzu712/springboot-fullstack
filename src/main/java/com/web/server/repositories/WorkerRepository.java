package com.web.server.repositories;

import com.web.server.models.Worker;
import com.web.server.utils.AppLogger;
import com.web.server.database.DatabaseManager;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class WorkerRepository implements IRepositoryMethods<Worker> {
    private Connection connection;

    public WorkerRepository() {
        try {  
            this.connection = DatabaseManager.getConnection();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public Worker findOneById(int id) {
        String sql = "SELECT * FROM worker WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new Worker()
                    .setId(rs.getInt("id"))
                    .setName(rs.getString("name"))
                    .setRole(rs.getString("role"));
            }
        } catch (SQLException e) {
            AppLogger.error(e.getMessage() + "\nStackTrace:" + e.getStackTrace());
        }
        return null;
    }

    public Worker[] findAll() {
        String sql = "SELECT * FROM worker";
        List<Worker> workers = new ArrayList<>();
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Worker worker = new Worker()
                    .setId(rs.getInt("id"))
                    .setName(rs.getString("name"))
                    .setRole(rs.getString("role"));
                workers.add(worker);
            }
        } catch (SQLException e) {
            AppLogger.error(e.getMessage() + "\nStackTrace:" + e.getStackTrace());
        }
        return workers.toArray(new Worker[0]);
    }

    public void deleteOneById(int id) {
        String sql = "DELETE FROM worker WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            AppLogger.error(e.getMessage() + "\nStackTrace:" + e.getStackTrace());
        }
    }

    public void updateOneById(int id, Worker entity) {
        String sql = "UPDATE worker SET name = ?, role = ? WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, entity.getName());
            pstmt.setString(2, entity.getRole());
            pstmt.setInt(3, id);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            AppLogger.error(e.getMessage() + "\nStackTrace:" + e.getStackTrace());
        }
    }

    public void insertOne(Worker entity) {
        String sql = "INSERT INTO worker (name, role) VALUES (?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, entity.getName());
            pstmt.setString(2, entity.getRole());
            pstmt.executeUpdate();
        } catch (SQLException e) {
            AppLogger.error(e.getMessage() + "\nStackTrace:" + e.getStackTrace());
        }
    }
}