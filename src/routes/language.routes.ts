import express from "express";
import { getLanguages, postLanguage } from "../controllers/language.controller";
import { verifyToken } from "../middlewares/authtoken";

const router = express.Router();

router.get("/languages",verifyToken,getLanguages);
router.post("/languages", verifyToken,postLanguage);

export default router;
