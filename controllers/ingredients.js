const express = require('express');
const router = express.Router();
const Ingredient = require('../models/ingredient.js');

// Index - GET /ingredients
router.get('/', async (req, res) => {
    try {
        const ingredients = await Ingredient.find({});
        res.render('ingredients/index.ejs', { ingredients });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// Create - POST /ingredients
router.post('/', async (req, res) => {
    try {
        await Ingredient.create(req.body);
        res.redirect('/ingredients');
    } catch (error) {
        console.log(error);
        res.redirect('/ingredients');
    }
});

module.exports = router;