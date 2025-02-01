import { Router } from "express";
import animalsController from "../controller/animalsController.js";

const animalsRouter = Router();

animalsRouter.get("/", animalsController.animalsGET);

animalsRouter.get("/new", animalsController.animalNewGET);

animalsRouter.post("/new", animalsController.animalNewPOST);

animalsRouter.get("/:id", animalsController.animalsIdGET);

animalsRouter.get("/:id/edit", animalsController.animalsEditGET);

animalsRouter.post("/:id/edit/new_fact", animalsController.animalsNewFactPOST);

animalsRouter.post(
  "/:id/edit/new_description",
  animalsController.animalsNewDescriptionPOST
);

animalsRouter.get(
  "/:id/facts/:fact_id/delete",
  animalsController.animalsFactsDELETE
);
animalsRouter.get(
  "/:id/descriptions/:description_id/delete",
  animalsController.animalsDescriptionDELETE
);

animalsRouter.post("/:id/edit", animalsController.animalsEditPOST);

animalsRouter.get("/:id/delete", animalsController.animalsDELETE);

export default animalsRouter;
