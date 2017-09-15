var express = require('express');
var app = express.Router();
var controller = require('../controllers/app.controller.js');

app.get('/', controller.main);

module.exports = app;