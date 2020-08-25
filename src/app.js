const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryExistence(request, response, next) {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0)
    return response.status(400).json({ error: 'Repository not found.' });

  return next();
}

function validateRepositoryId(request, response, next){
  const { id } = request.params;

  if (!isUuid(id))
    return response.status(400).json({ error: 'Invalid Id.'});

  return next();
}

app.use('/repositories/:id', validateRepositoryId);
app.use('/repositories/:id', validateRepositoryExistence);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;
  
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  const likes = repositories[repoIndex].likes;

  repositories[repoIndex] = {
    id,
    title,
    url,
    techs,
    likes
  };

  return response.status(204).json();
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  repositories.splice(repoIndex, 1);

  return response.status(204).json();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repoIndex = repositories.findIndex(repo => repo.id === id);

  const { title, url, techs, likes }  = repositories[repoIndex]; 

  repositories[repoIndex] = {
    id,
    title,
    url,
    techs,
    likes: likes+1
  };

  return response.json(repositories[repoIndex]);
  
});

module.exports = app;
