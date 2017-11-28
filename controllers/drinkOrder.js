var drinkMenu = require('../models').drinksDb;
var Menu = drinkMenu.Menu;
var Drink = drinkMenu.Drink;
var Option = drinkMenu.Option;
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
        if (err) return res.status(400).send(err);
        res.status(200) && res.json({ success: true });
    })
}
exports.addDrink = (req, res) => {
    let drink = new Drink({
        name: req.body.name,
        menu: req.body.menuId,
        price: req.body.price
    })
    drink.save(err => {
        if (err) return res.status(400).send(err);
        res.status(200) && res.json({ success: true });
    })
}

exports.editMenu = (req, res) => {
    let id = req.params.id;
    Menu.findById(id, (err, menu) => {
        if (err) return res.status(400).send(err);
        menu.name = req.body.name;
        menu.save((err, updateMenu) => {
            if (err) return res.status(400).send(err);
            res.status(200).send(updateMenu);
        })
    })
}

exports.editDrink = (req, res) => {
    let id = req.params.id;
    Drink.findById(id, (err, drink) => {
        drink.name = req.body.name;
        if (req.body.menuId && req.body.menuId != '')
            drink.menu = req.body.menuId;
        if (req.body.price && req.body.price != '')
            drink.price = req.body.price;
        drink.save((err, updateDrink) => {
            if (err) return res.status(400).send(err);
            res.status(200).send(updateDrink);
        })
    })
}

exports.delMenu = (req, res) => {
    let id = req.params.id;
    Drink.find({ menu: id }, (err, drinks) => {
        if (drinks.length === 0) {
            Menu.findOneAndRemove({ _id: ObjectId(id) }, err => {
                if (err) return res.status(400).send(err);
                res.status(200).send({ message: 'Delete successfully', success: true });
            })
        } else {
            res.status(400).send({ message: 'Can not delete, Please clear all constraints!', success: true })
        }
    })
}

exports.delDrink = (req, res) => {
    let id = req.params.id;
    Drink.findOneAndRemove({ _id: ObjectId(id) }, err => {
        if (err) return res.status(400).send(err);
        res.status(200).send({ message: 'Delete successfully', success: true });
    })
}

exports.getAllOption = (req, res) => {
    Option.find({}, (err, options) => {
        if (err) return res.status(400) && res.json(err);
        res.json(options)
    })
}
exports.delOption = (req, res) => {
    let id = req.params.id;
    Option.findOneAndRemove({ _id: ObjectId(id) }, err => {
        if (err) return res.status(400).send(err);
        res.status(200).send({ message: 'Delete successfully', success: true });
    })
}

exports.editOption = (req, res) => {
    let id = req.params.id;
    Option.findById(id, (err, option) => {
        if (req.body.value && req.body.value != '')
            option.value = req.body.value;
        if (req.body.question && req.body.question != '')
            option.question = req.body.question;
        option.save((err, updateOption) => {
            if (err) return res.status(400).send(err);
            res.status(200).send(updateOption);
        })
    })
}

exports.addOption = (req, res) => {
    let option = new Option({
        value: req.body.value,
        question: req.body.question
    })
    option.save(err => {
        if (err) return res.status(400).send(err);
        res.status(200) && res.json({ success: true });
    })
}
