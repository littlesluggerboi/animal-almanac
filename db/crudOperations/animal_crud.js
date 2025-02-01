import pool from "../pool.js";
import factFetcher from "./fact_crud.js";
import descriptionFetcher from "./description_crud.js";

function AnimalFetcher() {
  const getAllAnimals = async () => {
    const query =
      "SELECT animal.*, category.name AS category, category.vertebrate FROM animal LEFT JOIN category ON animal.category_id = category.id;";
    try {
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getAllAnimalsByCategoryId = async (id) => {
    const query = `
      SELECT 
        animal.*,
        category.name as category,
        category.vertebrate
      FROM animal 
        LEFT JOIN category 
        ON animal.category_id = category.id 
      WHERE animal.category_id = $1;`;
    try {
      const { rows } = await pool.query(query, [id]);
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const getAnimalById = async (id) => {
    const query = `
    SELECT 
      animal.*,
      category.name as category,
      category.vertebrate
    FROM animal
      LEFT JOIN category 
        ON animal.category_id = category.id
    WHERE animal.id = $1;`;
    try {
      const { rows } = await pool.query(query, [id]);
      if (rows.length === 0) {
        throw new Error(`No animal with id: ${id}`);
      }
      const animal = rows[0];
      const facts = await factFetcher.getFactbyAnimalId(animal.id);
      const descriptions = await descriptionFetcher.getDescriptionByAnimalId(
        animal.id
      );
      return {
        ...animal,
        facts: facts,
        descriptions: descriptions,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const deleteAnimalById = async (id) => {
    const query = `
    BEGIN;
    DELETE FROM animal_unit WHERE animal_id = ${id};
    DELETE FROM description WHERE animal_id = ${id};
    DELETE FROM fact WHERE animal_id = ${id};
    DELETE FROM animal WHERE id = ${id};
    COMMIT;
    `;
    try {
      await pool.query(query);
    } catch (error) {
      throw new Error(error);
    }
  };

  return {
    getAllAnimals,
    getAnimalById,
    getAllAnimalsByCategoryId,
    deleteAnimalById,
  };
}

const animalFetcher = new AnimalFetcher();

export default animalFetcher;
