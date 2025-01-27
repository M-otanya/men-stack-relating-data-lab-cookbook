const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');

// Index - Community Page
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}).populate('recipes');
        res.render('users/index.ejs', { users });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// Show - User Profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('recipes');
        const recipes = await Recipe.find({ owner: req.params.id }).populate('ingredients');
        res.render('users/show.ejs', { profileUser: user, recipes });
    } catch (error) {
        console.log(error);
        res.redirect('/users');
    }
});

module.exports = router;