import Users from "../models/UserModel.js";
// import { argon2d } from "argon2";
import * as argon2 from "argon2";

export const getUsers = async (req, res) => {
    try {
        const response = await Users.findAll({
            attributes: ["uuid", "name", "email", "role"],
        });
        res.status(200).json({
            status: true,
            msg: "User data found",
            data: response,
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const response = await Users.findOne({
            attributes: ["uuid", "name", "email", "role"],
            where: {
                uuid: req.params.id,
            },
        });
        res.status(200).json({
            status: true,
            msg: "User data found",
            data: response,
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createUser = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;

    // Jika user login sebagai "user" maka tidak boleh membuat akun
    if (req.session.userId) {
        const loggedInUser = await Users.findOne({
            where: {
                uuid: req.session.userId,
            },
        });
        if (loggedInUser && loggedInUser.role !== "admin") {
            return res
                .status(403)
                .json({ msg: "You are not allowed to create an account!" });
        }
    }

    // Validasi password
    if (password != confPassword)
        return res
            .status(400)
            .json({ msg: "Password and Confirm Password doesnt match!" });

    try {
        // Cek apakah email sudah terdaftar
        const existingUser = await Users.findOne({
            where: {
                email,
            },
        });
        if (existingUser) {
            return res.status(400).json({ msg: "Email Already Registered!" });
        }
        // Hash password
        const hashPassword = await argon2.hash(password);

        // Buat user baru
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role,
        });
        res.status(201).json({ msg: "Register Success!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const updateUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id,
        },
    });
    // Cek user
    if (!user) return res.status(404).json({ msg: "User not found!" });

    // Jika ditemukan, user harus memasukan password untuk update data
    const { name, email, password, confPassword, role } = req.body;
    // Validasi password
    let hashPassword;
    if (password === "" || password === null) {
        hashPassword = user.password;
    } else {
        hashPassword = await argon2.hash(password);
    }
    if (password != confPassword)
        return res
            .status(400)
            .json({ msg: "Password and Confirm Password doesnt match!" });

    try {
        await Users.update(
            {
                name: name,
                email: email,
                password: hashPassword,
                role: role,
            },
            {
                where: {
                    id: user.id,
                },
            }
        );
        res.status(200).json({ msg: "User Updated!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id,
        },
    });
    // Cek user
    if (!user) return res.status(404).json({ msg: "User not found!" });
    try {
        await Users.destroy({
            where: {
                id: user.id,
            },
        });
        res.status(200).json({ msg: "User Deleted!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
