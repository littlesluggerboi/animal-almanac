import dotenv from "dotenv";
import pkg from "pg";
dotenv.config();

const {Pool} = pkg;
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database:process.env.DB_DATABASE,
    password:process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

export default pool;