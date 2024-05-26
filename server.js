const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();
connectDB();


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/post", require("./routes/postRoutes.js"));


const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.bgCyan.white);
});
