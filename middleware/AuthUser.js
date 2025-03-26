import Users from "../models/UserModel.js";

export const VerifyUser = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: "Please login to your account!" });
    }
    // Cari data user berdasarkan session
    const user = await Users.findOne({
        where: {
            uuid: req.session.userId,
        },
    });
    // Cek user
    if (!user) return res.status(404).json({ msg: "User not found!" });

    req.userId = user.id;
    req.role = user.role;
    next();
};

export const AdminOnly = async (req, res, next) => {
    // Cari data user berdasarkan session
    const user = await Users.findOne({
        where: {
            uuid: req.session.userId,
        },
    });
    // Cek user
    if (!user) return res.status(404).json({ msg: "User not found!" });

    // Validasi
    if (user.role !== "admin")
        return res.status(403).json({ msg: "Forbidden Access!" });
    next();
};
