const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_KEY = process.env.SPOONACULAR_KEY;
const BASE_URL = "https://api.spoonacular.com";

router.get("/random", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/random`, {
      params: { apiKey: API_KEY, number: 1 }
    });
    console.log(response.data);
    const recipe = response.data.recipes[0];
    const simplified = {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      servings: recipe.servings,
      cookingTime: recipe.cookingMinutes,
      duration: recipe.readyInMinutes,
      instructions: recipe.instructions,
      ingredients: recipe.extendedIngredients.map(i => i.original)
    };
    
    res.json(simplified);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch random recipe" });
  }
});

router.get("/search", async (req, res) => {
  const { ingredients } = req.query;

  try {
    const response = await axios.get(`${BASE_URL}/recipes/findByIngredients`, {
      params: {
        apiKey: API_KEY,
        ingredients,
        number: 20
      }
    });

    const results = response.data.map(res => ({
      title: res.title,
      image: res.image,
      id: res.id,
      usedIngredients: res.usedIngredients.map(i => i.name),
      missedIngredients: res.missedIngredients.map(i => i.name)
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to search recipes" });
  }
});

router.get("/details/:id", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/${req.params.id}/information`, {
      params: { apiKey: API_KEY }
    });

    const recipe = response.data;
    const simplified = {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      servings: recipe.servings,
      cookingTime: recipe.cookingMinutes,
      duration: recipe.readyInMinutes,
      instructions: recipe.instructions,
      ingredients: recipe.extendedIngredients.map(i => i.original)
    };

    res.json(simplified);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipe details" });
  }
});


module.exports = router;
