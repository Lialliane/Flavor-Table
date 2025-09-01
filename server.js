const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

const morgan = require("morgan");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const homeRoutes = require("./routes/home");
const recipeRoutes = require("./routes/recipes");

app.use("/", homeRoutes);
app.use("/recipes", recipeRoutes);

app.use(morgan("dev"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
