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
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
});

pool.on("connect", () => {
    console.log("Connected to PostgreSQL database");
});

const initializeDB = async () => {
    try {
        // Create default overall-admin if it doesn't exist
        const result = await pool.query("SELECT * FROM users WHERE username = $1", ['Admin']);
        if (result.rows.length === 0) {
            const hashedPassword = await bcrypt.hash("password", 10); // Hash the default password
            await pool.query(
                "INSERT INTO users (username, password, role) VALUES ($1, $2, $3)",
                ['Admin', hashedPassword, 'admin']
            );
            console.log("Default admin created.");
        }
    } catch (error) {
        console.error("Database initialization error:", error);
    }
};

const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};


initializeDB();

export { query };
export default pool;
