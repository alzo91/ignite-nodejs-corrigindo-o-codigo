const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function validateRepository(request, response, next) {
  const { id } = request.params;

  if (!id) {
    return response
      .status(400)
      .json({ error: "Please, you should be informed a repository" });
  }

  const repository = repositories.find((repo) => repo.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repository = repository;
  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);
  return response.status(201).json(repository);
});

app.put("/repositories/:id", validateRepository, (request, response) => {
  const { repository } = request;
  const { title, url, techs } = request.body;

  repositories.forEach((repo) => {
    if (repo.id === repository.id) {
      if (title) repo.title = title;
      if (url) repo.url = url;
      if (techs) repo.techs = techs;
    }
  });

  return response.json(repository);
});

app.delete("/repositories/:id", validateRepository, (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

  // return response.status(204).json(repositories);
});

app.post("/repositories/:id/like", validateRepository, (request, response) => {
  const { repository } = request;

  repository.likes = repository.likes + 1;

  return response.json({ likes: repository.likes });
});

module.exports = app;
