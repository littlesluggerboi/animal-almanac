import pool from "../pool.js";

export default function Transaction() {
  
  const begin = async () => {
    await pool.query("BEGIN;");
  }

  const commit = async () => {
    await pool.query("COMMIT;");
  }

  const transact = async (query, params = []) => {
    return await pool.query(query, params);
  }

  return{
    begin, commit, transact
  }
  
}
