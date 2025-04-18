// config/db.js
import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt"; // Import bcrypt

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

pool.on("connect", () => {
    console.log("Connected to PostgreSQL database");
});

const initializeDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'admin', 'overall-admin')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Users table initialized");

        // Create default overall-admin if it doesn't exist
        const result = await pool.query("SELECT * FROM users WHERE username = $1", ['Admin']);
        if (result.rows.length === 0) {
            const hashedPassword = await bcrypt.hash("password", 10); // Hash the default password
            await pool.query(
                "INSERT INTO users (username, password, role) VALUES ($1, $2, $3)",
                ['Admin', hashedPassword, 'overall-admin']
            );
            console.log("Default overall-admin created.");
        }
    } catch (error) {
        console.error("Database initialization error:", error);
    }
};

const query = (text, params) => {
    return pool.query(text, params);
};


initializeDB();

exports.query = query;
exports.default = pool;
