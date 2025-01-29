import pool from "../pool.js";
import featureFetcher from "./feature_crud.js";

function CategoryFetcher() {
  const getAllCategories = async () => {
    const query = "SELECT * FROM category;";
    const { rows } = await pool.query(query);
    const categories = await Promise.all(
      rows.map(async (val) => {
        const features = await featureFetcher.getFeaturesByCategory(val.id);
        return {
          ...val,
          features: features,
        };
      })
    );
    return categories;
  };

  const getCategorySimple = async () => {
    const query = "SELECT * FROM category;";
    const { rows } = await pool.query(query);
    return rows;
  };

  const getCategoryById = async (id) => {
    const query = `
        SELECT 
            *
        FROM category
        WHERE id = $1;
        `;
    const { rows } = await pool.query(query, [id]);
    if (rows.length === 0) {
      throw new Error("Category Not Found");
    }
    const result = rows[0];
    return result;
  };

  return {
    getAllCategories,
    getCategoryById,
    getCategorySimple
  };
}

const categoryFetcher = new CategoryFetcher();

export default categoryFetcher;
