import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import categoriesRouter from "./routes/categoriesRoutes.js";
import animalsRouter from "./routes/animalsRoutes.js";
import pool from "./db/pool.js";

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

app.get("/practice", async (req, res, next) => {
  console.log("wauth")
  try {
    await pool.query("BEGIN");
    await pool.query("INSERT INTO unit (category, name, abbreviation) VALUES ('length', 'meters','m');")
    await pool.query("ROOLBACK;");
    await pool.query("COMMIT;");
    res.send("success");
  } catch (error) {
    next(error);
  }
})

app.use((err, req, res, next)=>{
  console.log(err.message);
  res.status(500).send("Error 500 | Internal Error");
})

app.use((req, res)=>{
    res.status(404).send("Error 404 | Not Found")
})


app.listen(PORT, () => {
  console.log(`Listening at port: ${PORT}`);
});
