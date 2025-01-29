import pool from "../pool.js";

function DescriptionFetcher() {
  const getDescriptionByAnimalId = async (id) => {
    const query = `SELECT * FROM description WHERE animal_id = $1;`;
    const { rows } = await pool.query(query, [id]);
    return rows;
  };

  const getDescriptionById = async (id) => {
    const query = "SELECT * FROM description WHERE id = $1;";
    const { rows } = await pool.query(query, [id]);
    return rows;
  };

  const insertNewDescription = async ({ id, new_description }) => {
    const query = `INSERT INTO description (animal_id, description) VALUES ($1, $2);`;
    await pool.query(query, [id, new_description]);
  };

  const deleteByIdAndAnimalId = async ({ id, description_id }) => {
    const query = `DELETE FROM description WHERE id = $1 AND animal_id = $2;`;
    await pool.query(query, [description_id, id]);
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
