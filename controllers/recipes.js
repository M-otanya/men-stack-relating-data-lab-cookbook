const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');
const User = require('../models/user.js');

// Index - GET /recipes
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find({ owner: req.session.user._id }).populate('ingredients');
        res.render('recipes/index.ejs', { recipes });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// New - GET /recipes/new
router.get('/new', async (req, res) => {
    try {
        const ingredients = await Ingredient.find({});
        res.render('recipes/new.ejs', { ingredients });
    } catch (error) {
        console.log(error);
        res.redirect('/recipes');
    }
});

// Create - POST /recipes
router.post('/', async (req, res) => {
    try {
        req.body.owner = req.session.user._id;
        if (typeof req.body.ingredients === 'string') {
            req.body.ingredients = [req.body.ingredients];
        }
        const recipe = await Recipe.create(req.body);
        
        // Add recipe reference to user
        await User.findByIdAndUpdate(
            req.session.user._id,
            { $push: { recipes: recipe._id } }
        );
        
        res.redirect('/recipes');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// Show - GET /recipes/:id
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('ingredients')
            .populate('owner', 'username');
            
        const isOwner = recipe.owner._id.equals(req.session.user._id);
        
        res.render('recipes/show.ejs', { recipe, isOwner });
    } catch (error) {
        console.log(error);
        res.redirect('/recipes');
    }
});

// Edit - GET /recipes/:id/edit
router.get('/:id/edit', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        // Check if user owns this recipe
        if (!recipe.owner.equals(req.session.user._id)) {
            return res.redirect('/recipes');
        }
        const ingredients = await Ingredient.find({});
        res.render('recipes/edit.ejs', { recipe, ingredients });
    } catch (error) {
        console.log(error);
        res.redirect('/recipes');
    }
});

// Update - PUT /recipes/:id
router.put('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        // Check if user owns this recipe
        if (!recipe.owner.equals(req.session.user._id)) {
            return res.redirect('/recipes');
        }
        if (typeof req.body.ingredients === 'string') {
            req.body.ingredients = [req.body.ingredients];
        }
        await Recipe.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/recipes/${req.params.id}`);
    } catch (error) {
        console.log(error);
        res.redirect('/recipes');
    }
});

// Delete - DELETE /recipes/:id
router.delete('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        // Check if user owns this recipe
        if (!recipe.owner.equals(req.session.user._id)) {
            return res.redirect('/recipes');
        }
        await Recipe.findByIdAndDelete(req.params.id);
        
        // Remove recipe reference from user
        await User.findByIdAndUpdate(
            req.session.user._id,
            { $pull: { recipes: req.params.id } }
        );
        
        res.redirect('/recipes');
    } catch (error) {
        console.log(error);
        res.redirect('/recipes');
    }
});

module.exports = router;