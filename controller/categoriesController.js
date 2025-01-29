import categoryFetcher from "../db/crudOperations/category_crud.js";
import animalFetcher from "../db/crudOperations/animal_crud.js";
import { attachUnits } from "../utils/utils.js";

function CategoriesController() {
  const categoriesGET = async (req, res) => {
    const categories = await categoryFetcher.getAllCategories();
    res.render("categories", {
      categories: categories,
    });
  };
  
  const categoriesIdGET = async (req, res) => {
    const id = req.params.id;
    const category_title = await categoryFetcher.getCategoryById(id);
    const animals = await animalFetcher.getAllAnimalsByCategoryId(id);
    const result = await attachUnits(animals);
    res.render("animal", {
      animals: result,
      title: category_title,
    });
  }
  
  return{
    categoriesGET,
    categoriesIdGET
  }
}

const categoriesController = new CategoriesController();

export default categoriesController;
