import pool from "../pool.js";

function AnimalUnitFetcher() {
  const getAllUnitsByAnimalId = async (id) => {
    const query = `
        SELECT 
            u.*
        FROM animal_unit AS au 
            JOIN animal AS a
            ON au.animal_id = a.id
            JOIN unit AS u
            ON au.unit_id = u.id
        WHERE au.animal_id = $1;`;
    try {
      const { rows } = await pool.query(query, [id]);
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getUnitByAnimalIdAndCategory = async ({ id, category }) => {
    const query = `
      SELECT
        au.*
      FROM animal_unit AS au
        JOIN unit AS u
        ON au.unit_id = u.id
      WHERE au.animal_id = $1 
      AND u.category = $2;
    `;
    try {
      const { rows } = await pool.query(query, [id, category]);
      if (rows.length === 0) {
        throw new Error("No records found");
      }
      return rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {
    getAllUnitsByAnimalId,
    getUnitByAnimalIdAndCategory,
  };
}

const animalUnitFetcher = new AnimalUnitFetcher();

export default animalUnitFetcher;
