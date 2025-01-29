import animalUnitFetcher from "../db/crudOperations/animal_unit_crud.js";
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

  function updateColumnQueyBuilder(table, column, value, id) {
    const query = `UPDATE ${table} SET ${column} = '${value}' WHERE id = ${id};`;
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

  export {attachUnit, attachUnits, updateColumnQueyBuilder, processArray}