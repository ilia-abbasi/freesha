import express from "express";

import { error404Middleware } from "../middlewares/response.js";
import registerRouter from "./register.js";
import verifyemailRouter from "./verifyemail.js";
import loginRouter from "./login.js";
import logoutRouter from "./logout.js";
import usersRouter from "./users.js";
import jobPostsRouter from "./job_posts.js";

const router = express.Router();

router.use("/register", registerRouter);
router.use("/verifyemail", verifyemailRouter);
router.use("/login", loginRouter);
router.use("/logout", logoutRouter);
router.use("/users", usersRouter);
router.use("/job_posts", jobPostsRouter);

router.all("/{*anything}", error404Middleware);

export default router;
