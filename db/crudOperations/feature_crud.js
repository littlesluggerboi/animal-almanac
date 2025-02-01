import pool from "../pool.js";

function FeatureFetcher() {
  const getFeaturesByCategory = async (category_id) => {
    const query = "SELECT feature FROM feature WHERE category_id = $1";
    try {
      const { rows } = await pool.query(query, [category_id]);
      return rows;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {
    getFeaturesByCategory,
  };
}

const featureFetcher = new FeatureFetcher();

export default featureFetcher;
