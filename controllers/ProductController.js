import Products from "../models/ProductModel.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";

export const getProducts = async (req, res) => {
    try {
        let response;
        if (req.role === "admin") {
            // Jika admin, ambil semua produk tanpa filter userId
            response = await Products.findAll({
                attributes: ["uuid", "name", "price"],
                include: [
                    {
                        model: Users, // Sertakan informasi pengguna (relasi dengan tabel user)
                        attributes: ["name", "email"],
                    },
                ],
            });
        } else {
            // Jika user, ambil hanya produk milik user yang sedang login
            response = await Products.findAll({
                attributes: ["uuid", "name", "price"],
                where: {
                    userId: req.userId, // Filter berdasarkan ID user yang sedang login
                },
                include: [
                    {
                        model: Users,
                        attributes: ["name", "email"],
                    },
                ],
            });
        }
        res.status(200).json({
            status: true,
            message: "Product data list",
            data: response,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            data: [],
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Products.findOne({
            where: {
                uuid: req.params.id,
            },
        });

        if (!product)
            return res.status(404).json({ msg: "Product Not Found!" });

        let response; // Variabel untuk menyimpan hasil query
        if (req.role === "admin") {
            // Jika admin, ambil semua produk tanpa filter userId
            response = await Products.findOne({
                attributes: ["uuid", "name", "price"],
                where: {
                    id: product.id, // select by ID karena uuid sudah didapat pada variabel product
                },
                include: [
                    {
                        model: Users, // Sertakan informasi pengguna (relasi dengan tabel user)
                        attributes: ["name", "email"],
                    },
                ],
            });
        } else {
            // Jika user, ambil hanya produk milik user yang sedang login
            response = await Products.findOne({
                attributes: ["uuid", "name", "price"],
                where: {
                    [Op.and]: [{ id: product.id }, { userId: req.userId }],
                    // Gunakan Op.and untuk memastikan produk yang diambil harus:
                    // 1. Memiliki ID yang sama dengan produk yang ditemukan
                    // 2. Dimiliki oleh user yang sedang login (userId sama dengan req.userId)
                },
                include: [
                    {
                        model: Users,
                        attributes: ["name", "email"],
                    },
                ],
            });
        }
        res.status(200).json({
            status: true,
            message: "Product is found",
            data: response,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            data: [],
        });
    }
};

export const createProduct = async (req, res) => {
    const { name, price } = req.body;
    try {
        const product = await Products.create({
            name: name,
            price: price,
            userId: req.userId,
        });
        // res.status(201).json({ msg: "Product Created Successfuly" });
        res.status(201).json({
            status: true,
            msg: "Product Created Successfuly",
            data: {
                id: product.id,
                name: product.name,
                price: product.price,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            data: [],
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Products.findOne({
            where: {
                uuid: req.params.id,
            },
        });

        if (!product)
            return res.status(404).json({ msg: "Product Not Found!" });

        const { name, price } = req.body;
        if (req.role === "admin") {
            await Products.update(
                {
                    name, // Shorthand untuk name: name
                    price, // Shorthand untuk price: price
                },
                {
                    where: {
                        id: product.id,
                    },
                }
            );
        } else {
            if (req.userId !== product.userId)
                return res.status(403).json({ msg: "Forbidden Access!" });
            await Products.update(
                {
                    name,
                    price,
                },
                {
                    where: {
                        [Op.and]: [{ id: product.id }, { userId: req.userId }],
                    },
                }
            );
        }
        res.status(200).json({
            status: true,
            msg: "Product Updated Successfuly!",
        });
    } catch (error) {
        res.status(500).json({ status: false, msg: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Products.findOne({
            where: {
                uuid: req.params.id,
            },
        });

        if (!product)
            return res.status(404).json({ msg: "Product Not Found!" });

        const { name, price } = req.body;
        if (req.role === "admin") {
            await Products.destroy({
                where: {
                    id: product.id,
                },
            });
        } else {
            if (req.userId !== product.userId)
                return res.status(403).json({ msg: "Forbidden Access!" });
            await Products.destroy({
                where: {
                    [Op.and]: [{ id: product.id }, { userId: req.userId }],
                },
            });
        }
        res.status(200).json({
            status: true,
            msg: "Product Deleted Successfuly!",
        });
    } catch (error) {
        res.status(500).json({ status: false, msg: error.message });
    }
};
