import pool from "../pool.js";

function UnitFetcher() {
  const getAllUnits = async () => {
    const query = `
        SELECT
            *
        FROM unit;
        `;
    const { rows } = await pool.query(query);
    return rows;
  };

  const getAllUnitsByCategory = async (category) =>{
    const query = `
    SELECT
        *
    FROM unit
    WHERE category = $1;
    `
    const {rows} = await pool.query(query, [category]);
    return rows;
  }

  return {
    getAllUnits,
    getAllUnitsByCategory
  }
}

const unitFetcher = new UnitFetcher();

export default unitFetcher;
