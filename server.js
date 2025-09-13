const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

const morgan = require("morgan");

const { Pool } = require("pg");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const homeRoutes = require("./routes/home");
const recipeRoutes = require("./routes/recipes");
const favoritesRoutes = require("./routes/favorites");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

app.use("/", homeRoutes);
app.use("/recipes", recipeRoutes);
app.use("/favorites", favoritesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(morgan("dev"));

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.connect()
  .then(() => console.log("connected to postgres"))
  .catch(err => console.error("post connection error:", err));

  app.locals.pool = pool;