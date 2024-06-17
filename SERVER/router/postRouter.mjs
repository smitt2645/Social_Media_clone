import express from "express";
import { PostsClass } from "../controller/postController.mjs";
import { PostsModel } from "../model/PostModel.mjs";

const router = express.Router();

router.route("/create").post(PostsClass.createPosts);
router.route("/:id/get").get(PostsClass.getPosts);
router.route("/:id/update").put(PostsClass.updatePosts);
router.route("/:id/delete").delete(PostsClass.deletePosts);
router.route("/:id/like").put(PostsClass.likePosts);
router.route("/:id/timeline").get(PostsClass.getTimeLinePosts);

export default router;