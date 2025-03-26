import { Sequelize } from "sequelize";
import Db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Products = Db.define(
    "products",
    {
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [3, 100],
            },
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    },
    {
        freezeTableName: true,
    }
);

// Relasi One to Many
Users.hasMany(Products);
Products.belongsTo(Users, { foreignKey: "userId" });

export default Products;
