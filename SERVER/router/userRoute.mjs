import express from "express";
import { UserClass } from "../controller/userController.mjs";

const router = express.Router();
router.route("/get/:id").get(UserClass.GetUser);
router.put("/get/:id",UserClass.UpdateUser);
router.delete("/get/:id",UserClass.DeleteUser);
router.put("/get/:id/follow",UserClass.FollowUser);
router.put("/get/:id/unfollow",UserClass.UnFollowUser);


export default router;