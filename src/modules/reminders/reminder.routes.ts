import { Router } from "express";

const router = Router();

router.post("/", (_req, res) => {
  return res.status(201).json({
    success: true,
    message: "Reminder created"
  });
});

export default router;