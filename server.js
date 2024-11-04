const express = require("express");
const {
  create,
  findAll,
  getById,
  update,
  remove,
} = require("./repositories/alunosRepository");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const port = 3000;

app.use(express.json());

const SwaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Alunos",
      version: "1.0.0",
      description: "API para gerenciar alunos",
    },
  },
  apis: ["./server.js"], // Caminho dos comentários para a documentação
};

const swaggerDocs = swaggerJsdoc(SwaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /alunos:
 *   post:
 *     summary: Cria um novo aluno
 *     description: Cadastra um novo aluno com nome, email e curso.
 *     tags:
 *       - Alunos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - nome_curso
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do aluno
 *                 example: Antonio Henrique
 *               email:
 *                 type: string
 *                 description: E-mail do aluno
 *                 example: antonio.henrique@example.com
 *               nome_curso:
 *                 type: string
 *                 description: Nome do curso
 *                 example: Ciencia da computacao
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID do aluno criado
 *                   example: "1"
 *                 nome:
 *                   type: string
 *                   description: Nome do aluno
 *                   example: Antonio Henrique
 *                 email:
 *                   type: string
 *                   description: E-mail do aluno
 *                   example: antonio.henrique@example.com
 *                 nome_curso:
 *                   type: string
 *                   description: Nome do curso
 *                   example: Ciencia da computacao
 *       400:
 *         description: Erro de validação de e-mail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro
 *                   example: "E-mail inválido"
 */
app.post("/alunos", (req, res) => {
  const { nome, email, nome_curso } = req.body;
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; //Validação de e-mail

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "E-mail inválido" });
  }

  const aluno = create({ nome, email, nome_curso });
  res.status(201).json(aluno);
});

/**
 * @swagger
 * /alunos:
 *   get:
 *     summary: Retorna todos os alunos
 *     description: Retorna uma lista com todos os alunos cadastrados.
 *     tags:
 *       - Alunos
 *     responses:
 *       200:
 *         description: Lista de alunos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   nome:
 *                     type: string
 *                     example: Antonio Henrique
 *                   email:
 *                     type: string
 *                     example: antonio.henrique@example.com
 *                   nome_curso:
 *                     type: string
 *                     example: ciencia da computacao
 */
app.get("/alunos", (req, res) => {
  const alunos = findAll();
  res.json(alunos);
});

/**
 * @swagger
 * /alunos/{id}:
 *   get:
 *     summary: Retorna um aluno pelo ID
 *     description: Busca um aluno específico pelo seu ID.
 *     tags:
 *       - Alunos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Dados do aluno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 nome:
 *                   type: string
 *                   example: Antonio Henrique
 *                 email:
 *                   type: string
 *                   example: antonio.henrique@example.com
 *                 nome_curso:
 *                   type: string
 *                   example: ciencia da computacao
 *       404:
 *         description: Aluno não encontrado
 */

app.get("/alunos/:id", (req, res) => {
  const id = req.params.id; // Corrigido para usar o UUID como string
  const aluno = getById(id);

  if (!aluno) {
    return res.status(404).json({ error: "Aluno não encontrado" });
  }

  res.json(aluno);
});

/**
 * @swagger
 * /alunos/{id}:
 *   put:
 *     summary: Atualiza os dados de um aluno
 *     description: Atualiza as informações de um aluno específico pelo seu ID.
 *     tags:
 *       - Alunos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Antonio Henrique
 *               email:
 *                 type: string
 *                 example: antonio.henrique@example.com
 *               nome_curso:
 *                 type: string
 *                 example: ciencia da computacao
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso
 *       404:
 *         description: Aluno não encontrado
 */

app.put("/alunos/:id", (req, res) => {
  const id = req.params.id;
  const { nome, email, nome_curso } = req.body;

  const updatedAluno = update(id, { nome, email, nome_curso });
  if (!updatedAluno) {
    return res
      .status(404)
      .json({ error: "Aluno não encontrado para atualização" });
  }

  res.json(updatedAluno);
});

/**
 * @swagger
 * /alunos/{id}:
 *   delete:
 *     summary: Exclui um aluno
 *     description: Remove um aluno pelo seu ID.
 *     tags:
 *       - Alunos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do aluno
 *     responses:
 *       204:
 *         description: Aluno excluído com sucesso
 *       404:
 *         description: Aluno não encontrado
 */

app.delete("/alunos/:id", (req, res) => {
  const id = req.params.id;
  const success = remove(id);

  if (!success) {
    return res
      .status(404)
      .json({ error: "Aluno não encontrado para exclusão" });
  }

  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
