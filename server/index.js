const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoute = require("./routes/user");

const PORT = 12345;
const DBNAME = "groise";

mongoose.connect(`mongodb://localhost:27017/${DBNAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on("open", (data) => {
    console.log(`connected to ${DBNAME} db`);
});

// mongoose.connection.close();


app.use("/user", userRoute);


app.listen(PORT, () => {
    console.log(`listening on ${PORT}...`);
});
