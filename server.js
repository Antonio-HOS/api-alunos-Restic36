const express = require("express");
const { create } = require("./repositories/alunosRepository");

const app = express();
const port = 3000;

app.post("/alunos", (req, res) => {
  const { nome, email, nome_curso } = req.body;
  const aluno = create({ nome, email, nome_curso });
  res.status(201).json(aluno);
});

app.use(express.json());
