import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: "https://d68130aeae33dd5399371835c954e02d@o4510397357621248.ingest.de.sentry.io/4510397362470992",
    integrations: [
        Sentry.replayIntegration(),
    ],
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});
