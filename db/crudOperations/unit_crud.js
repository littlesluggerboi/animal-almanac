import pool from "../pool.js";

function UnitFetcher() {
  const getAllUnits = async () => {
    const query = `
        SELECT
            *
        FROM unit;
        `;
    try {
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getAllUnitsByCategory = async (category) => {
    const query = `
    SELECT
        *
    FROM unit
    WHERE category = $1;
    `;
    try {
      const { rows } = await pool.query(query, [category]);
      return rows;
    } catch (error) {
      throw new error(error.message);
    }
  };

  return {
    getAllUnits,
    getAllUnitsByCategory,
  };
}

const unitFetcher = new UnitFetcher();

export default unitFetcher;
