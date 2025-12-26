import { Router } from "express";
import { getHospitals, addHospital, seedHospitals } from "../controllers/hospital.controller";

const router = Router();

router.get("/", getHospitals);
router.post("/", addHospital);
router.post("/seed", seedHospitals);

export default router;
