const express = require('express');
const {create,update} = require('./repositories/alunosRepository');

const app = express();
const port = 3000;

app.use(express.json());
