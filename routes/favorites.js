const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM favorites");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

router.post("/", async (req, res) => {
  const { id, title, image, instructions, ingredients, readyin } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO favorites (recipe_id, title, image, instructions, ingredients, readyin)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id, title, image, instructions, JSON.stringify(ingredients), readyin]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save recipe" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM favorites WHERE id = $1", [req.params.id]);
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to delete recipe" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, image, instructions, ingredients, readyin } = req.body;
  const readyInNum = parseInt(readyin, 10);

  try {
    const result = await pool.query(
      `UPDATE favorites
       SET title = $1, image = $2, instructions = $3, ingredients = $4, readyin = $5
       WHERE id = $6 RETURNING *`,
      [ title, image, instructions, JSON.stringify(ingredients), readyInNum, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Recipe not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

module.exports = router;
