import pool from "../pool.js";

function FeatureFetcher(){
    const getFeaturesByCategory = async (category_id) =>{
        const query = "SELECT feature FROM feature WHERE category_id = $1";
        const {rows} = await pool.query(query, [category_id]);
        return rows;
    }

    return {
        getFeaturesByCategory
    }
}

const featureFetcher = new FeatureFetcher();

export default featureFetcher;