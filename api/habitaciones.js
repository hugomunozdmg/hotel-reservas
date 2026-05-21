import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  const response = await req.app.locals.db
    .collection("habitaciones")
    .find()
    .toArray();
  res.send({ data: response });
});

export default router;
