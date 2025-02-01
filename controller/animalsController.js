import animalFetcher from "../db/crudOperations/animal_crud.js";
import {
  attachUnit,
  attachUnits,
  updateColumnQueyBuilder,
  processArray,
} from "../utils/utils.js";
import categoryFetcher from "../db/crudOperations/category_crud.js";
import unitFetcher from "../db/crudOperations/unit_crud.js";
import Transaction from "../db/crudOperations/transaction.js";
import animalUnitFetcher from "../db/crudOperations/animal_unit_crud.js";
import factFetcher from "../db/crudOperations/fact_crud.js";
import descriptionFetcher from "../db/crudOperations/description_crud.js";

function AnimalsController() {
  const animalsGET = async (req, res, next) => {
    try {
      const animals = await animalFetcher.getAllAnimals();
      const result = await attachUnits(animals);
      res.render("animal", {
        animals: result,
        title: { name: "All Animals" },
      });
    } catch (error) {
      next(error);
    }
  };

  const animalsIdGET = async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const animal = await animalFetcher.getAnimalById(id);
      const result = await attachUnit(animal);
      res.render("animal_focus.ejs", {
        animal: result,
      });
    } catch (error) {
      next(error);
    }
  };

  const animalsEditGET = async (req, res, next) => {
    try {
      const id = req.params.id;
      const animal = await animalFetcher.getAnimalById(id);
      const result = await attachUnit(animal);
      const categories = await categoryFetcher.getCategorySimple();
      const weight_units = await unitFetcher.getAllUnitsByCategory("weight");
      const time_units = await unitFetcher.getAllUnitsByCategory("time");
      const length_units = await unitFetcher.getAllUnitsByCategory("length");
      res.render("animal_edit", {
        animal: result,
        categories: categories,
        weights: weight_units,
        times: time_units,
        lengths: length_units,
      });
    } catch (error) {
      next(error);
    }
  };

  const animalsEditPOST = async (req, res, next) => {
    // update the field then redirect to animals.edit or animal_focus?
    try {
      const { id } = req.params;
      const animal = await animalFetcher.getAnimalById(id);
      const transaction = new Transaction();
      await transaction.begin();
      // 1. name - name
      if (animal.name != req.body.name) {
        const query = "UPDATE animal SET name = $1 WHERE id = $2;";
        await transaction.transact(query, [req.body.name, id]);
      }
      // 2. scientific_name - scientific_name
      if (animal.scientific_name != req.body.scientific_name) {
        const query = "UPDATE animal SET scientific_name = $1 WHERE id = $2;";
        await transaction.transact(query, [req.body.scientific_name, id]);
      }
      // 3. natural_habitat - natural_habitat
      if (animal.natural_habitat != req.body.natural_habitat) {
        const query = "UPDATE animal SET natural_habitat = $1 WHERE id = $2;";
        await transaction.transact(query, [req.body.natural_habitat, id]);
      }
      // 4. category
      if (animal.category_id != req.body.classification) {
        const query = "UPDATE animal SET category_id = $1 WHERE id = $2;";
        await transaction.transact(query, [req.body.classification, id]);
      }

      // 5. img_url
      if (animal.img_url != req.body.img_url) {
        const query = "UPDATE animal SET img_url = $1 WHERE id = $2;";
        await transaction.transact(query, [req.body.img_url, id]);
      }
      // 6. weight
      if (animal.weight != req.body.weight) {
        const query = "UPDATE animal SET weight = $1 WHERE id = $2;";
        await transaction.transact(query, [req.body.weight, id]);
      }
      // 7. lifespan
      if (animal.lifespan != req.body.lifespan) {
        const query = "UPDATE animal SET lifespan = $1 WHERE id = $2;";
        await transaction.transact(query, [req.body.lifespan, id]);
      }
      // 8. length
      if (animal.length != req.body.length) {
        const query = "UPDATE animal SET length = $1 WHERE id = $2;";
        await transaction.transact(query, [req.body.lifespan, id]);
      }
      // 9.weight_unit
      const weight_query = `
      SELECT
        au.*
      FROM animal_unit AS au
        JOIN unit AS u
        ON au.unit_id = u.id
      WHERE au.animal_id = $1 
      AND u.category = $2;
    `;
      const weightUnitId = await animalUnitFetcher.getUnitByAnimalIdAndCategory(
        {
          id: id,
          category: "weight",
        }
      );
      if (weightUnitId.unit_id != req.body.weight_unit) {
        const sub_query = `
        UPDATE animal_unit SET unit_id = $1 WHERE animal_id = $2 AND unit_id = $3;
        `;
        await transaction.transact(sub_query, [
          req.body.weight_unit,
          id,
          weightUnitId.unit_id,
        ]);
      }
      // 10. lifespan_unit
      const timeUnitId = await animalUnitFetcher.getUnitByAnimalIdAndCategory({
        id: id,
        category: "time",
      });
      if (timeUnitId.unit_id != req.body.lifespan_unit) {
        const sub_query = `
        UPDATE animal_unit SET unit_id = $1 WHERE animal_id = $2 AND unit_id = $3;
        `;
        await transaction.transact(sub_query, [
          req.body.lifespan_unit,
          id,
          timeUnitId.unit_id,
        ]);
      }
      // 11. length_unit
      const lengthUnitId = await animalUnitFetcher.getUnitByAnimalIdAndCategory(
        {
          id: id,
          category: "length",
        }
      );
      if (lengthUnitId.unit_id != req.body.length_unit) {
        const sub_query = `
        UPDATE animal_unit SET unit_id = $1 WHERE animal_id = $2 AND unit_id = $3;
        `;
        await transaction.transact(sub_query, [
          req.body.length_unit,
          id,
          lengthUnitId.unit_id,
        ]);
      }

      // 12. facts // preprocess the facts
      const newFacts = processArray(req.body.fact);
      for (let fact of newFacts) {
        const oldFact = await factFetcher.getFactById(fact.id);
        if (oldFact.fact != fact.value) {
          const query = `UPDATE fact SET fact = $1 WHERE id = $2;`;
          await transaction.transact(query, [fact.value, fact.id]);
        }
      }

      // 13. descriptions// pre process the descriptions
      const newDescriptions = processArray(req.body.description);
      for (let description of newDescriptions) {
        const oldDescription = await descriptionFetcher.getDescriptionById(
          description.id
        );
        if (oldDescription.description != description.value) {
          const query = `UPDATE description SET description = $1 WHERE id = $2;`;
          await transaction.transact(query, [
            description.value,
            description.id,
          ]);
        }
      }
      await transaction.commit();

      res.redirect(`/animals/${id}`);
    } catch (error) {
      next(error);
    }
  };

  const animalsNewFactPOST = async (req, res, next) => {
    try {
      const id = req.params.id;
      const { new_fact } = req.body;

      await factFetcher.insertNewFact({ id, new_fact });
      res.redirect(`/animals/${id}/edit`);
    } catch (error) {
      next(error);
    }
  };

  const animalsNewDescriptionPOST = async (req, res, next) => {
    try {
      const id = req.params.id;
      const { new_description } = req.body;

      await descriptionFetcher.insertNewDescription({ id, new_description });
      res.redirect(`/animals/${id}/edit`);
    } catch (error) {
      next(error);
    }
  };

  const animalsDescriptionDELETE = async (req, res, next) => {
    try {
      const { description_id, id } = req.params;
      await descriptionFetcher.deleteByIdAndAnimalId({ id, description_id });
      res.redirect(`/animals/${id}/edit`);
    } catch (error) {
      next(error);
    }
  };

  const animalsFactsDELETE = async (req, res, next) => {
    try {
      const { fact_id, id } = req.params;
      await factFetcher.deleteByIdAndAnimalId({ id, fact_id });
      res.redirect(`/animals/${id}/edit`);
    } catch (error) {
      next(error);
    }
  };

  const animalsDELETE = async (req, res, next) => {
    try {
      await animalFetcher.deleteAnimalById(req.params.id);
      res.redirect("/animals");
    } catch (error) {
      next(error);
    }
  };

  const animalNewGET = async (req, res, next) => {
    try {
      const categories = await categoryFetcher.getCategorySimple();
      const weight_units = await unitFetcher.getAllUnitsByCategory("weight");
      const time_units = await unitFetcher.getAllUnitsByCategory("time");
      const length_units = await unitFetcher.getAllUnitsByCategory("length");

      res.render("animal_new.ejs", {
        categories,
        weights: weight_units,
        times: time_units,
        lengths: length_units,
      });
    } catch (error) {
      next(error);
    }
  };

  const animalNewPOST = async (req, res, next) => {
    try {
      const transaction = new Transaction();
      await transaction.begin();
      const animalQuery = `
      INSERT INTO animal (name, scientific_name, category_id, img_url, natural_habitat, lifespan, weight, length)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `;
      await transaction.transact(animalQuery, [
        req.body.name,
        req.body.scientific_name,
        req.body.classification,
        req.body.img_url,
        req.body.natural_habitat,
        req.body.lifespan,
        req.body.weight,
        req.body.length,
      ]);

      const getIdQuery = `
      SELECT id FROM animal WHERE scientific_name = $1;  
      `;
      const { rows } = await transaction.transact(getIdQuery, [req.body.scientific_name]);
      const animal_id = rows[0].id;

      if (typeof req.body.fact === "string") {
        const insertFacts = `
        INSERT INTO fact (fact, animal_id) VALUES($1, $2);
        `;
        await transaction.transact(insertFacts, [req.body.fact, animal_id]);
      } else {
        for (let fact of req.body.fact) {
          const insertFacts = `
          INSERT INTO fact (fact, animal_id) VALUES($1, $2);
          `;
          await transaction.transact(insertFacts, [fact, animal_id]);
        }
      }

      if (typeof req.body.description === "string") {
        const insertDescription = `
        INSERT INTO description (description, animal_id) VALUES($1, $2);
        `;
        await transaction.transact(insertDescription, [req.body.description, animal_id]);
      } else {
        for (let description of req.body.description) {
          const insertDescription = `
          INSERT INTO description (description, animal_id) VALUES($1, $2);
          `;
          await transaction.transact(insertDescription, [description, animal_id]);
        }
      }

      await transaction.transact("INSERT animal_unit (unit_id, animal_id) VALUES ($1, $2);", [req.body.weight_unit, animal_id]);
      await transaction.transact("INSERT animal_unit (unit_id, animal_id) VALUES ($1, $2);", [req.body.length_unit, animal_id]);
      await transaction.transact("INSERT animal_unit (unit_id, animal_id) VALUES ($1, $2);", [req.body.lifespan_unit, animal_id]);
      await transaction.commit();
      res.redirect(`/animals/${animal_id}`);
    } catch (error) {
      next(error);
    }
  };

  return {
    animalNewGET,
    animalNewPOST,
    animalsDELETE,
    animalsDescriptionDELETE,
    animalsFactsDELETE,
    animalsEditGET,
    animalsGET,
    animalsIdGET,
    animalsEditGET,
    animalsEditPOST,
    animalsNewFactPOST,
    animalsNewDescriptionPOST,
  };
}

const animalsController = new AnimalsController();
export default animalsController;
