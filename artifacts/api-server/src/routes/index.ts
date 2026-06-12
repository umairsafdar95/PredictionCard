import { Router, type IRouter } from "express";
import healthRouter from "./health";
import wcRouter from "./wc";

const router: IRouter = Router();

router.use(healthRouter);
router.use(wcRouter);

export default router;
