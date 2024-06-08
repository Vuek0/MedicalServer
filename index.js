// Import
const express = require("express");
const users = require("./routes/users")
// Middlewares
const app = express();
app.use(express.json());

// Routes
app.get("/users", users);


// Connection
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));