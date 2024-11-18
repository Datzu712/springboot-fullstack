package com.web.server.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseManager {
    private static final String DB_URL = "jdbc:sqlite:server.db";
    private static Connection connection = null;

    private DatabaseManager() {}

    public static Connection getConnection() throws SQLException {
        if (connection == null) {
            connection = DriverManager.getConnection(DB_URL);
            initializeDatabase();
        }
        return connection;
    }

    private static void initializeDatabase() throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS client (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "name VARCHAR NOT NULL," +
                "email VARCHAR," +
                "phone VARCHAR" +
            ");");
            stmt.executeUpdate("CREATE UNIQUE INDEX IF NOT EXISTS client_id_uindex ON client (id);");
    
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS product (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "name VARCHAR," +
                "description VARCHAR," +
                "price REAL" +
            ");");
            stmt.executeUpdate("CREATE UNIQUE INDEX IF NOT EXISTS product_id_uindex ON product (id);");
    
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS sale (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "purchaseDate DATE NOT NULL," +
                "product_id INTEGER NOT NULL," +
                "client_id INTEGER NOT NULL," +
                "amount INTEGER NOT NULL," +
                "FOREIGN KEY (product_id) REFERENCES product(id)," +
                "FOREIGN KEY (client_id) REFERENCES client(id)" +
            ");");
            stmt.executeUpdate("CREATE UNIQUE INDEX IF NOT EXISTS sale_id_uindex ON sale (id);");
    
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS worker (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "name VARCHAR NOT NULL," +
                "role VARCHAR NOT NULL" +
            ");");
            stmt.executeUpdate("CREATE UNIQUE INDEX IF NOT EXISTS worker_id_uindex ON worker (id);");
        }
    }
}
