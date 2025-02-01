import categoryFetcher from "../db/crudOperations/category_crud.js";
import animalFetcher from "../db/crudOperations/animal_crud.js";
import { attachUnits } from "../utils/utils.js";

function CategoriesController() {
  const categoriesGET = async (req, res, next) => {
    try {
      const categories = await categoryFetcher.getAllCategories();
      res.render("categories", {
        categories: categories,
      });
    } catch (error) {
      next(error);
    }
  };

  const categoriesIdGET = async (req, res, next) => {
    try {
      const id = req.params.id;
      const category_title = await categoryFetcher.getCategoryById(id);
      const animals = await animalFetcher.getAllAnimalsByCategoryId(id);
      const result = await attachUnits(animals);
      res.render("animal", {
        animals: result,
        title: category_title,
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    categoriesGET,
    categoriesIdGET,
  };
}

const categoriesController = new CategoriesController();

export default categoriesController;
