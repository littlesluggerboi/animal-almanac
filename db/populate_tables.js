#! /usr/bin/env node
import pool from "./pool.js";
import categories from "./categories.js";
import features from "./features.js";
import units from "./units.js";
import animals from "./animals.js";
import animal_units from "./animal_unit.js";
import descriptions from "./description.js";
import facts from "./facts.js";

async function main() {
  console.log("Injecting data to categories...");
  for (let category of categories) {
    const query = "INSERT INTO category (vertebrate, name) VALUES ($1, $2);";
    await pool.query(query, [category.vertebrate, category.name]);
  }
  console.log("Loading categories complete...");

  console.log("Injecting data to features...");
  for (let feature of features) {
    const query = "INSERT INTO feature (feature, category_id) VALUES ($1, $2);";
    await pool.query(query, [feature.feature, feature.category_id]);
  }
  console.log("Loading features complete...");

  console.log("Injecting data to unit...");
  for (let unit of units) {
    const query =
      "INSERT INTO unit (category, name, abbreviation) VALUES ($1, $2, $3);";
    await pool.query(query, [unit.category, unit.name, unit.abbreviation]);
  }
  console.log("Loading unit complete...");

  console.log("Injecting data to animal...");
  for (let animal of animals) {
    const query = `INSERT INTO animal 
    (name, scientific_name, category_id, img_url, natural_habitat, lifespan, weight, length) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
    `;
    await pool.query(query, [
      animal.name,
      animal.scientific_name,
      animal.category_id,
      animal.img_url,
      animal.natural_habitat,
      animal.lifespan,
      animal.weight,
      animal.length,
    ]);
  }
  console.log("Loading animal complete...");

  console.log("Injecting data to animal_unit...");
  for (let animal_unit of animal_units) {
    const query =
      "INSERT INTO animal_unit (unit_id, animal_id) VALUES ($1, $2);";
    await pool.query(query, [animal_unit.unit_id, animal_unit.animal_id]);
  }
  console.log("Loading animal_unit complete...");

  console.log("Injecting data to fact...");
  for (let fact of facts) {
    const query = "INSERT INTO fact (fact, animal_id) VALUES ($1, $2);";
    await pool.query(query, [fact.fact, fact.animal_id]);
  }
  console.log("Loading fact complete...");

  console.log("Injecting data to description");
  for (let description of descriptions) {
    const query =
      "INSERT INTO description (description, animal_id) VALUES($1, $2);";
    await pool.query(query, [description.description, description.animal_id]);
  }
  console.log("Loading description complete...")
}

main();
