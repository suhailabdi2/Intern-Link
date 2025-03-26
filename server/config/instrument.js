// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"
import { nodeProfilingIntegration } from "@sentry/profiling-node";


Sentry.init({
  dsn: "https://a67ed0f2ba7c4e48210f2b748a71ee60@o4509045844869120.ingest.us.sentry.io/4509045876457472",
  integrations:[
    nodeProfilingIntegration(),
    Sentry.mongooseIntegration()
  ],

  // Set sampling rate for profiling - this is evaluated only once per SDK.init
  profileSessionSampleRate: 1.0,
});

Sentry.profiler.startProfiler();