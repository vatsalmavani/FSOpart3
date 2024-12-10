const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(morgan("tiny"));

const logger = (req, res, next) => {
  console.log(req.body);
  next();
};
app.use(logger);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.send(`phonebook has info for ${persons.length} people<br/>${Date()}`);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) res.json(person);
  else res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  // console.log("log from the post request handler function");
  if (!req.body.name || !req.body.number) {
    res.status(400).json({ error: "name and number are necessary fields" });
    return;
  }
  if (persons.find((person) => person.name === req.body.name)) {
    res.status(409).json({ error: "name must be unique" });
    return;
  }

  const id = String(Math.round(Math.random() * 10 ** 6));
  const person = {
    id: id,
    name: req.body.name,
    number: req.body.number,
  };
  persons = persons.concat(person);
  res.json(person);
});

app.listen(3001);
