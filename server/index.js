const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const redis = require("redis");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const app = express();
const userRoute = require("./routes/user");
const authSysRoute = require("./routes/authSys");
const phoneRoute = require("./routes/phone");
const cartRoute = require("./routes/cart");

const PORT = 12345;
const DBNAME = "groise";
process.env.SECRET = "lokistrikeand0trytofightWithhIm";

mongoose.connect(`mongodb://localhost:27017/${DBNAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on("open", (data) => {
    console.log(`connected to ${DBNAME} db`);
});

// mongoose.connection.close();

app.use(session({
    secret: "veryVerYsEcreT",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    },
    store: new RedisStore({ client: redis.createClient() })
}));

app.use(bodyParser.json());
app.use("/", authSysRoute);
app.use("/user", userRoute);
app.use("/phone", phoneRoute);
app.use("/cart", cartRoute);

app.use((req, res, next) => {
    res.send(`cant get ${req.url}`);
});


app.listen(PORT, () => {
    console.log(`listening on ${PORT}...`);
});
