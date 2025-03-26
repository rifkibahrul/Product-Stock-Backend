import Users from "../models/UserModel.js";
import * as argon2 from "argon2";

export const Login = async (req, res) => {
    const user = await Users.findOne({
        where: {
            email: req.body.email,
        },
    });
    // Cek user
    if (!user) return res.status(404).json({ msg: "User not found!" });

    // Verify password
    const match = await argon2.verify(user.password, req.body.password);

    // Jika password tidak cocok
    if (!match) {
        return res.status(400).json({ msg: "Wrong Password!" });
    }

    req.session.userId = user.uuid;
    const uuid = user.uuid;
    const name = user.name;
    const email = user.email;
    const role = user.role;
    res.status(200).json({ uuid, name, email, role });
};

export const Me = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Please login to your account!" });
    }
    const user = await Users.findOne({
        attributes: ['uuid', 'name', 'email', 'role'],
        where: {
            uuid: req.session.userId,
        },
    });
    // Cek user
    if (!user) return res.status(404).json({ msg: "User not found!" });

    res.status(200).json(user);
};

export const Logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ msg: "Cant logout!" });
        res.status(200).json({ msg: "Logout Success!" });
    });
};
