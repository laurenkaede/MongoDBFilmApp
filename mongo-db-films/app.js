const express = require("express");
const hbs = require("hbs");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const Film = require("./models/film");
const methodOverride = require("method-override");
hbs.registerHelper("equal", require("handlebars-helper-equal"))

const app = express();

const viewsPath = path.join(__dirname, "./views");
const partialPath = path.join(__dirname, "/views/inc");
const publicDirectory = path.join(__dirname, "./public");

dotenv.config({
  path: "./config.env",
});

hbs.registerPartials(partialPath);

app.use(express.urlencoded());
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(publicDirectory));

app.set("view engine", "hbs");
app.set("views", viewsPath);

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is connected"));

app.get("/", async (req, res) => {
  try {
    const films = await Film.find().sort({"year":+1});
    res.render("index", {
      data: films,
    });
  } catch (error) {
    status: error.message;
  }
});

app.get("/addFilm", (req, res) => {
  res.render("addFilm");
});

app.post("/addFilm/film", async (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const actor = req.body.actor;
  const description = req.body.description;
  const year = req.body.year;

  try {
    const newFilm = await Film.create({
      name,
      actor,
      description,
      year,
    });

    res.status(201).json(newFilm);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status: error.message,
    });
  }
});

app.put("/editFilm/:id", async (req, res) => {
  const filmId = req.params.id;
  const film = await Film.findById(filmId);

  res.render("editFilm", {
    data: film,
  });
});

app.put("/editFilm/:id/success", async (req, res) => {
  const filmId = req.params.id;

  const filmUpdate = await Film.findByIdAndUpdate(filmId, {
    name: req.body.editName,
    actor: req.body.editActor,
    description: req.body.editDescription,
    year: req.body.editYear,
  });
  res.status(200).send("<h1>Film Updated");
});

app.delete("/delete/:id", async (req, res) => {
  const filmId = req.params.id;
  const filmToDelete = await Film.findByIdAndRemove(filmId);

  res.send("<h1>Film Deleted</h1>");
});

app.listen(8000, (req, res) => {
  console.log("Server is running on port 8000");
});
