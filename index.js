// Import
const express = require("express");
const cors = require('cors');
const app = express();
const users = require("./routes/users");
const PORT = process.env.PORT || 3333;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({origin: '*'}))
// Routes
app.use('/users', users);

// Connection
app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));