import express from "express";
import { getUsers, updateUserRole } from "../controllers/adminController.js";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";

const router = express.Router();

router.use(protect, allowRoles("admin"));
router.get("/users", getUsers);
router.patch("/users/:id/role", updateUserRole);

export default router;
