const express = require("express");
const router = express.Router();
const pg = require("pg");
const routeGuard = require("../middleware/verifyToken");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });


router.get("/profile", routeGuard, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username, email FROM users WHERE id = $1", [req.user.id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

module.exports = router;