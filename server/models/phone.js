const Sequelize = require("sequelize");
const db = new Sequelize("test", "k.zakharchuk", "qwerty", { dialect: "postgres" });

const Phone = db.define("phone", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    brand: Sequelize.STRING,
    model: Sequelize.STRING,
    price: Sequelize.INTEGER
}, {
    timestamps: false
});

Phone.sync(/*{ force: true }*/)
.then((modelName) => {
    console.log("table created: " + modelName.tableName);
});

module.exports = Phone;
