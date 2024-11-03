const { v4: uuidv4 } = require("uuid");

let alunos = [];

function create({ nome, email, nome_curso }) {
  const aluno = {
    id: uuidv4(),
    nome,
    email,
    nome_curso,
  };
  alunos.push(aluno);
  return aluno;
}




module.exports = {
  create,
 
};
