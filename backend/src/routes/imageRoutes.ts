import {Router} from "express";
import {ImageController} from "../controllers/ImageController";

const router = Router();

router.get("/", ImageController.getAllImages);
router.get("/:id", ImageController.getImageById);
router.post("/create", ImageController.createImage);
router.delete("/:id/delete", ImageController.deleteImage);

export default router;