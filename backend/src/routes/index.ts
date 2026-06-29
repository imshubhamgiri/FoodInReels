import { Router } from "express"
import v1Routes from "./v1Routes";
import v2Routes from "./v2Routes";

const rootRouter = Router();

// Map your feature routes to their respective base paths
rootRouter.use('/v1',v1Routes);
rootRouter.use('/v2',v2Routes);

export default rootRouter; 