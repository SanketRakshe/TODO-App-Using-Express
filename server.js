const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

// Helper function to read the TODOs from the file
const readTodos = () => {
  const data = fs.readFileSync('todos.json');
  return JSON.parse(data);
};

// Helper function to write the TODOs to the file
const writeTodos = (todos) => {
  fs.writeFileSync('todos.json', JSON.stringify(todos, null, 2));
};

// Get all TODOs
app.get('/todos', (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// Get a specific TODO by ID
app.get('/todos/:id', (req, res) => {
  const todos = readTodos();
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).send('TODO not found');
  res.json(todo);
});

// Create a new TODO
app.post('/todos', (req, res) => {
  const todos = readTodos();
  const newTodo = {
    id: todos.length + 1,
    task: req.body.task,
    completed: false,
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

// Update an existing TODO by ID
app.put('/todos/:id', (req, res) => {
  const todos = readTodos();
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).send('TODO not found');

  todo.task = req.body.task;
  todo.completed = req.body.completed;
  writeTodos(todos);
  res.json(todo);
});

// Delete a TODO by ID
app.delete('/todos/:id', (req, res) => {
  let todos = readTodos();
  const todoIndex = todos.findIndex((t) => t.id === parseInt(req.params.id));
  if (todoIndex === -1) return res.status(404).send('TODO not found');

  todos = todos.filter((t) => t.id !== parseInt(req.params.id));
  writeTodos(todos);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
