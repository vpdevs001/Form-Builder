import { router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { formRouter } from "./routes/form/route";
import { formFieldRouter } from "./routes/form-field/route";
import { submissionRouter } from "./routes/submission/route";
import { submissionValueRouter } from "./routes/submission-value/route";
import { analyticsRouter } from "./routes/analytics/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  form: formRouter,
  formField: formFieldRouter,
  submission: submissionRouter,
  submissionValue: submissionValueRouter,
  analytics: analyticsRouter,
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
