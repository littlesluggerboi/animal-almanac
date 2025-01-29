import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import categoriesRouter from "./routes/categoriesRoutes.js";
import animalsRouter from "./routes/animalsRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, "public")));


app.get("/", (req, res) => {
  res.render("root");
});
app.use("/categories", categoriesRouter)

app.use("/animals", animalsRouter)

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(PORT, () => {
  console.log(`Listening at port: ${PORT}`);
});
