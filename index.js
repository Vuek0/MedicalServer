// Import
const express = require("express");
const app = express();
const users = require("./routes/users");
const PORT = process.env.PORT || 3333;
console.log(process.env);
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes
app.use('/users', users);

// Connection

app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));