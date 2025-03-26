import { Sequelize } from "sequelize";

const Db = new Sequelize('auth_db', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default Db