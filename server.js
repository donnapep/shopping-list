var express = require("express");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

var Storage = function() {
  this.items = [];
  this.id = 0;
};

Storage.prototype.add = function(name) {
  var item = { name: name, id: this.id };

  this.items.push(item);
  this.id += 1;

  return item;
};

Storage.prototype.edit = function(id, name) {
  var item = null;

  for (var i = 0; i < this.items.length; i++) {
    item = this.items[i];

    if (item.id == id) {
      item.name = name;
      return item;
    }
  }
};

Storage.prototype.delete = function(id) {
  var item = null;

  for (var i = 0; i < this.items.length; i++) {
    item = this.items[i];

    if (item.id == id) {
      return this.items.splice(i, 1);
    }
  }
};

var storage = new Storage();

storage.add("Broad beans");
storage.add("Tomatoes");
storage.add("Peppers");

var app = express();

app.use(express.static("public"));

app.get("/items", function(request, response) {
  response.json(storage.items);
});

app.post("/items", jsonParser, function(request, response) {
  if (!request.body) {
    return response.sendStatus(400);
  }

  var item = storage.add(request.body.name);

  response.status(201).json(item);
});

app.delete("/items/:id", jsonParser, function(request, response) {
  var item = storage.delete(request.params.id);

  if (!item) {
    return response.sendStatus(404);
  }

  response.status(200).json(item);
});

app.put('/items/:id', jsonParser, function(request, response) {
  if (!request.body) {
    return response.sendStatus(400);
  }

  var item = storage.edit(request.params.id, request.body.name);

  if (!item) {
    return response.sendStatus(404);
  }

  response.status(200).json(item);
});

app.listen(8000);

exports.app = app;
exports.storage = storage;