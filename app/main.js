import express from 'express';
import { readFileSync } from 'fs';
import { createServer } from 'https';

const httpPort = 80;
const httpsPort = 443;

/** @type {import("node:tls").SecureContextOptions} */
const httpsServerOptions = {
  key: readFileSync('./app/certs/rsa-private.key'),
  cert: readFileSync('./app/certs/x509-signed.crt'),
};

const app = express();

app.use(express.static('./app/served'));

const httpServer = app.listen(httpPort, () => {
  console.log(`HTTP server listening on port ${httpPort}`);
});

const httpsServer = createServer(httpsServerOptions, app);
httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS server listening on port ${httpsPort}`);
});

/** @type {NodeJS.SignalsListener} */
const shutdownHandler = (signal) => {
  console.log(`Received signal '${signal}'. Shutting down servers.`);

  try {
    const timeoutId = setTimeout(() => {
      throw new Error('Timeout error');
    }, 5000);
    httpServer.close();
    httpsServer.close();
    process.stdin.pause();
    clearTimeout(timeoutId);
  } catch (error) {
    console.error('Error during shutdown:', error.message);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdownHandler);
process.on('SIGINT', shutdownHandler);

process.stdin.on('data', (data) => {
  if (data.toString().trim() == 'q') {
    shutdownHandler('SIGINT');
  }
});

console.log("Press CTRL+C or type 'q' to exit.");
