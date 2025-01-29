import { Router } from "express";
import categoriesController from "../controller/categoriesController.js";

const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.categoriesGET);

categoriesRouter.get("/:id", categoriesController.categoriesIdGET);

export default categoriesRouter;