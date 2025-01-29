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
    const { rows } = await pool.query(query, [id]);
    return rows;
  };
  
  const getUnitByAnimalIdAndCategory = async ({id, category})=>{
    const  query = `
      SELECT
        au.*
      FROM animal_unit AS au
        JOIN unit AS u
        ON au.unit_id = u.id
      WHERE au.animal_id = $1 
      AND u.category = $2;
    `;
    const {rows} = await pool.query(query, [id, category]);
    if(rows.length === 0){
      throw new Error("No records found");
    }
    return rows[0];
  }

  return {
    getAllUnitsByAnimalId,
    getUnitByAnimalIdAndCategory
  };
}

const animalUnitFetcher = new AnimalUnitFetcher();

export default animalUnitFetcher;
