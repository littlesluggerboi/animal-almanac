import animalFetcher from "./db/crudOperations/animal_crud.js";
import animalUnitFetcher from "./db/crudOperations/animal_unit_crud.js";
import unitFetcher from "./db/crudOperations/unit_crud.js";

import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import categoryFetcher from "./db/crudOperations/category_crud.js";
import factFetcher from "./db/crudOperations/fact_crud.js";
import descriptionFetcher from "./db/crudOperations/description_crud.js";
import Transaction from "./db/crudOperations/transaction.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, "public")));

async function attachUnit(animal) {
  const units = await animalUnitFetcher.getAllUnitsByAnimalId(animal.id);
  const weight = units.find((unit) => unit.category === "weight");
  const time = units.find((unit) => unit.category === "time");
  const length = units.find((unit) => unit.category === "length");
  return {
    ...animal,
    units: {
      weight: weight,
      time: time,
      length: length,
    },
  };
}

async function attachUnits(animals) {
  const result = await Promise.all(animals.map(attachUnit));
  return result;
}

app.get("/", (req, res) => {
  res.render("root");
});

app.get("/categories", async (req, res) => {
  const categories = await categoryFetcher.getAllCategories();
  res.render("categories", {
    categories: categories,
  });
});

app.get("/categories/:id", async (req, res) => {
  const id = req.params.id;
  const category_title = await categoryFetcher.getCategoryById(id);
  const animals = await animalFetcher.getAllAnimalsByCategoryId(id);
  const result = await attachUnits(animals);
  res.render("animal", {
    animals: result,
    title: category_title,
  });
});

app.get("/animals", async (req, res) => {
  const animals = await animalFetcher.getAllAnimals();
  const result = await attachUnits(animals);
  res.render("animal", {
    animals: result,
    title: { name: "All Animals" },
  });
});
app.get("/animals/new", async (req, res) => {});

app.post("/animals/new", async (req, res) => {});

app.get("/animals/:id", async (req, res) => {
  const id = req.params.id;
  const animal = await animalFetcher.getAnimalById(id);
  const result = await attachUnit(animal);
  res.render("animal_focus.ejs", {
    animal: result,
  });
});

app.get("/animals/:id/edit", async (req, res) => {
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
});

app.post("/animals/:id/edit/new_fact", async (req, res) => {
  const id = req.params.id;
  const { new_fact } = req.body;

  await factFetcher.insertNewFact({ id, new_fact });
  res.redirect(`/animals/${id}/edit`);
});

app.post("/animals/:id/edit/new_description", async (req, res) => {
  const id = req.params.id;
  const { new_description } = req.body;

  await descriptionFetcher.insertNewDescription({ id, new_description });
  res.redirect(`/animals/${id}/edit`);
});

app.get("/animals/:id/facts/:fact_id/delete", async (req, res) => {
  const { fact_id, id } = req.params;
  await factFetcher.deleteByIdAndAnimalId({ id, fact_id });
  res.redirect(`/animals/${id}/edit`);
});

app.get(
  "/animals/:id/descriptions/:description_id/delete",
  async (req, res) => {
    const { description_id, id } = req.params;
    await descriptionFetcher.deleteByIdAndAnimalId({ id, description_id });
    res.redirect(`/animals/${id}/edit`);
  }
);

function updateColumnQueyBuilder(table, column, value, id) {
  const query = `UPDATE ${table} SET ${column} = "${value}" WHERE id = ${id};`;
  return query;
}

function processArray(arr) {
  const transformArr = [];
  for (let i = 0; i < arr.length; i += 2) {
    const id = parseInt(arr[i]);
    const value = arr[i + 1];
    transformArr.push({ id, value });
  }
  return transformArr;
}

app.post("/animals/:id/edit", async (req, res) => {
  // update the field then redirect to animals.edit or animal_focus?
  const { id } = req.params;
  const animal = await animalFetcher.getAnimalById(id);
  const transaction = new Transaction();

  // 1. name - name
  if (animal.name != req.body.name) {
    transaction.add(
      updateColumnQueyBuilder("animal", "name", req.body.name, id)
    );
  }
  // 2. scientific_name - scientific_name
  if (animal.scientific_name != req.body.scientific_name) {
    transaction.add(
      updateColumnQueyBuilder(
        "animal",
        "scientific_name",
        req.body.scientific_name,
        id
      )
    );
  }
  // 3. natural_habitat - natural_habitat
  if (animal.natural_habitat != req.body.natural_habitat) {
    transaction.add(
      updateColumnQueyBuilder(
        "animal",
        "natural_habitat",
        req.body.natural_habitat,
        id
      )
    );
  }
  // 4. category
  if (animal.category_id != req.body.classification) {
    transaction.add(
      updateColumnQueyBuilder(
        "animal",
        "category_id",
        req.body.classification,
        id
      )
    );
  }
  // 5. img_url
  if (animal.img_url != req.body.img_url) {
    transaction.add(
      updateColumnQueyBuilder("animal", "img_url", req.body.img_url, id)
    );
  }
  // 6. weight
  if (animal.weight != req.body.weight) {
    transaction.add(
      updateColumnQueyBuilder("animal", "weight", req.body.weight, id)
    );
  }
  // 7. lifespan
  if (animal.lifespan != req.body.lifespan) {
    transaction.add(
      updateColumnQueyBuilder("animal", "lifespan", req.body.lifespan, id)
    );
  }
  // 8. length
  if (animal.length != req.body.length) {
    transaction.add(
      updateColumnQueyBuilder("animal", "length", req.body.length, id)
    );
  }
  // 9.weight_unit
  const weightUnitId = await animalUnitFetcher.getUnitByAnimalIdAndCategory({
    id: id,
    category: "weight",
  });
  if (weightUnitId.unit_id != req.body.weight_unit) {
    const sub_query = `
    UPDATE animal_unit SET unit_id = ${req.body.weight_unit} WHERE animal_id = ${id} AND unit_id = ${weightUnitId.unit_id};
    `;
    transaction.add(sub_query);
  }
  // 10. lifespan_unit
  const timeUnitId = await animalUnitFetcher.getUnitByAnimalIdAndCategory({
    id: id,
    category: "time",
  });
  if (timeUnitId.unit_id != req.body.lifespan_unit) {
    const sub_query = `
    UPDATE animal_unit SET unit_id = ${req.body.lifespan_unit} WHERE animal_id = ${id} AND unit_id = ${timeUnitId.unit_id};
    `;
    transaction.add(sub_query);
  }
  // 11. length_unit
  const lengthUnitId = await animalUnitFetcher.getUnitByAnimalIdAndCategory({
    id: id,
    category: "length",
  });
  if (lengthUnitId.unit_id != req.body.length_unit) {
    const sub_query = `
    UPDATE animal_unit SET unit_id = ${req.body.length_unit} WHERE animal_id = ${id} AND unit_id = ${lengthUnitId.unit_id};
    `;
    transaction.add(sub_query);
  }

  // 12. facts // preprocess the facts
  const newFacts = processArray(req.body.fact);
  for (let fact of newFacts) {
    const oldFact = await factFetcher.getFactById(fact.id);
    if (oldFact.fact != fact.value) {
      const query = `UPDATE fact SET fact = '${fact.value}' WHERE id = ${fact.id};`;
      transaction.add(query);
    }
  }


  // 13. descriptions// pre process the descriptions
  const newDescriptions = processArray(req.body.description);
  for (let description of newDescriptions) {
    const oldDescription = await descriptionFetcher.getDescriptionById(
      description.id
    );
    if (oldDescription.description != description.value) {
      const query = `UPDATE description SET description = '${description.value}' WHERE id = ${description.id};`;
      transaction.add(query);
    }
  }
  await transaction.execute();

  res.redirect(`/animals/${id}`);
});

app.get("/animals/:id/delete", async (req, res) => {
  await animalFetcher.deleteAnimalById(req.params.id);
  res.redirect("/animals")
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(PORT, () => {
  console.log(`Listening at port: ${PORT}`);
});
