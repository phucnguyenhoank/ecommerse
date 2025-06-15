import express, { Request, Response } from "express";
import { upload } from "../middlewares/UpLoadMiddleware";
import { uploadFileBufferToCloudinary } from "../services/UpLoadService";

const router = express.Router();

router.post("/", upload.single("image"), (req: Request, res: Response): Promise<void> => {
  return (async () => {
    try {
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }

      const result = await uploadFileBufferToCloudinary(req.file.buffer);
      res.json({ url: result.url });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  })();
});

export default router;
