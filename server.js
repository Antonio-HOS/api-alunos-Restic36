const express = require("express");
const { create, findAll, getById, update, remove } = require("./repositories/alunosRepository");

const app = express();
const port = 3000;

app.use(express.json());

app.post("/alunos", (req, res) => {
  const { nome, email, nome_curso } = req.body;
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "E-mail inválido" });
  }

  const aluno = create({ nome, email, nome_curso });
  res.status(201).json(aluno);
});

app.get("/alunos", (req, res) => {
  const alunos = findAll();
  res.json(alunos);
});

app.get("/alunos/:id", (req, res) => {
  const id = req.params.id; // Corrigido para usar o UUID como string
  const aluno = getById(id);

  if (!aluno) {
    return res.status(404).json({ error: "Aluno não encontrado" });
  }

  res.json(aluno);
});

app.put("/alunos/:id", (req, res) => {
  const id = req.params.id;
  const { nome, email, nome_curso } = req.body;
  
  const updatedAluno = update(id, { nome, email, nome_curso });
  if (!updatedAluno) {
    return res.status(404).json({ error: "Aluno não encontrado para atualização" });
  }

  res.json(updatedAluno);
});

app.delete("/alunos/:id", (req, res) => {
  const id = req.params.id;
  const success = remove(id);

  if (!success) {
    return res.status(404).json({ error: "Aluno não encontrado para exclusão" });
  }

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
