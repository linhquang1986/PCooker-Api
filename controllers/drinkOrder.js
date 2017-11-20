var drinkMenu = require('../models').drinksDb;
var Menu = drinkMenu.Menu;
var Drink = drinkMenu.Drink;
var ObjectId = require('mongoose').Types.ObjectId;
// Menu.remove({}, (err, row) => {
//     if (err) {
//         console.log("Collection couldn't be removed" + err);
//         return;
//     }

//     console.log("collection removed")
// })
// Drink.remove({}, (err, row) => {
//     if (err) {
//         console.log("Collection couldn't be removed" + err);
//         return;
//     }

//     console.log("collection removed")
// })
exports.getAllMenu = (req, res) => {
    Menu.find({}, (err, menus) => {
        if (err) return res.status(400) && res.json(err);
        res.json(menus)
    })
}
exports.getAllDrink = (req, res) => {
    Drink.find().populate('Menu').exec((err, drinks) => {
        if (err) return res.status(400) && res.json(err);
        res.json(drinks)
    })
}
exports.getDrinkByMenu = (req, res) => {
    let menuId = req.params.id
    Drink.find({ 'menu': menuId }, (err, drinks) => {
        if (err) return res.status(400) && res.json(err);
        res.json(drinks)
    })
}
exports.addMenu = (req, res) => {
    let menu = new Menu({
        name: req.body.name
    })
    menu.save(err => {
        return res.status(400).send(err);
        res.status(200) && res.json({ success: true });
    })
}
exports.addDrink = (req, res) => {
    let drink = new Drink({
        name: req.body.name,
        menu: req.body.menuId
    })
    drink.save(err => {
        return res.status(400).send(err);
        res.status(200) && res.json({ success: true });
    })
}
