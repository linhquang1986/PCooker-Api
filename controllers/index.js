"use strict"
let witController = require('./witAi');
let drinkController = require('./drinkOrder');
let Controllers = {
  drinkController: drinkController,
  witController: witController
}
module.exports = Controllers;