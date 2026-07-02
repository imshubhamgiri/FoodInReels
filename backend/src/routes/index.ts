import { Router } from "express"
import v1Routes from "./v1Routes";
import v2Routes from "./v2Routes";
import v3Routes from "./v3Routes";
import { deprecateRoute } from "../middleware/deprecation";

const rootRouter = Router();

// Map your feature routes to their respective base paths
// Mark v1 as deprecated, sunsetting in 3 months, pointing users to v3
rootRouter.use('/v1', deprecateRoute('2026-10-01', '/api/v3'), v1Routes);
rootRouter.use('/v2', deprecateRoute('2027-01-01', '/api/v3'), v2Routes);
rootRouter.use('/v3', v3Routes)

export default rootRouter; 