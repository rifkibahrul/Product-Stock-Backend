import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser,
} from "../controllers/UserController.js";
import { VerifyUser, AdminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.post("/users", createUser);
// Middleware dapat diakses hanya ketika login
router.get("/users/:id", VerifyUser, AdminOnly, getUserById);
router.get("/users", VerifyUser, AdminOnly, getUsers);
router.patch("/users/:id", VerifyUser, AdminOnly, updateUser);
router.delete("/users/:id", VerifyUser, AdminOnly, deleteUser);

export default router;
