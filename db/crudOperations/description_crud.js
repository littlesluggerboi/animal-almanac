import pool from "../pool.js";

function DescriptionFetcher() {
  const getDescriptionByAnimalId = async (id) => {
    const query = `SELECT * FROM description WHERE animal_id = $1;`;
    try {
      const { rows } = await pool.query(query, [id]);
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getDescriptionById = async (id) => {
    const query = "SELECT * FROM description WHERE id = $1;";
    try {
      const { rows } = await pool.query(query, [id]);
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const insertNewDescription = async ({ id, new_description }) => {
    const query = `INSERT INTO description (animal_id, description) VALUES ($1, $2);`;
    try {
      await pool.query(query, [id, new_description]);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const deleteByIdAndAnimalId = async ({ id, description_id }) => {
    const query = `DELETE FROM description WHERE id = $1 AND animal_id = $2;`;
    try {
      await pool.query(query, [description_id, id]);
    } catch (error) {
      throw new Error(error.message);
    }
  };
  return {
    getDescriptionByAnimalId,
    insertNewDescription,
    deleteByIdAndAnimalId,
    getDescriptionById,
  };
}

const descriptionFetcher = new DescriptionFetcher();

export default descriptionFetcher;
