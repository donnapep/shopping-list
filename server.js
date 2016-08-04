var express = require("express");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

var Storage = function() {
  this.items = [];
  this.id = 0;
};

Storage.prototype.add = function(name) {
  var item = {name: name, id: this.id};

  this.items.push(item);
  this.id += 1;

  return item;
};

Storage.prototype.delete = function(id) {
  var oldLength = this.items.length;

  this.items = this.items.filter(function(item) {
    return item.id != id;
  });

  return this.items.length === (oldLength - 1);
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
  if (!request.body) {
    return response.status(400).json("Invalid body");
  }

  var success = storage.delete(request.params.id);

  if (success) {
    response.status(200).json(storage.items);
  }
  else {
    response.status(404).json("Invalid ID");
  }
});

// TODO
app.put("/items/:id", jsonParser, function(request, response) {

});

app.listen(8000);

exports.app = app;
exports.storage = storage;