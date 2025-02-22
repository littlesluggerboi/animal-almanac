import pool from "../pool.js";

function FactFetcher() {
  const getFactbyAnimalId = async (id) => {
    const query = "SELECT * FROM fact WHERE animal_id = $1;";
    try {
      const { rows } = await pool.query(query, [id]);
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getFactById = async (id) => {
    const query = "SELECT * FROM fact WHERE id = $1;";
    try {
      const { rows } = await pool.query(query, [id]);
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const insertNewFact = async ({ id, new_fact }) => {
    const query = `INSERT INTO fact (animal_id, fact) VALUES ($1, $2);`;
    try {
      await pool.query(query, [id, new_fact]);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const deleteByIdAndAnimalId = async ({ id, fact_id }) => {
    const query = `DELETE FROM fact WHERE id = $1 AND animal_id = $2;`;
    try {
      await pool.query(query, [fact_id, id]);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {
    getFactbyAnimalId,
    insertNewFact,
    deleteByIdAndAnimalId,
    getFactById,
  };
}

const factFetcher = new FactFetcher();

export default factFetcher;
