import express from "express";

import { createJobPostValidator } from "../middlewares/validation.js";
import { verifyUser } from "../middlewares/auth.js";
import { createJobPost } from "../controllers/job_posts.js";

const router = express.Router();

router.post("/", verifyUser, createJobPostValidator(), createJobPost);

export default router;
