import * as Sentry from '@sentry/nestjs';

Sentry.init({
  dsn: 'https://b34458c59f4f5a29340ede22aa80b2f4@o4510184038727680.ingest.de.sentry.io/4510184068612176',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
