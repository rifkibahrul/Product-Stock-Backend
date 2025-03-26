import express from "express";
import {
    getProductById,
    getProducts,
    createProduct,
    deleteProduct,
    updateProduct,
} from "../controllers/ProductController.js";
import { VerifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.post("/products", VerifyUser, createProduct);
router.get("/products", VerifyUser, getProducts);
router.get("/products/:id", VerifyUser, getProductById);
router.patch("/products/:id", VerifyUser, updateProduct);
router.delete("/products/:id", VerifyUser, deleteProduct);

export default router;
