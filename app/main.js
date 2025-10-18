import express from 'express';
import { readFileSync } from 'fs';
import { createServer } from 'https';

const httpPort = 80;
const httpsPort = 443;

/** @type {import("node:tls").SecureContextOptions} */
const httpsServerOptions = {
  key: readFileSync('./app/certs/rsa-private.key'),
  cert: readFileSync('./app/certs/x509-signed.crt')
};

const app = express()

app.use(express.static('./app/served'));

const httpServer = app.listen(httpPort, () => {
  console.log(`HTTP server listening on port ${httpPort}`);
})

const httpsServer = createServer(httpsServerOptions, app);
httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS server listening on port ${httpsPort}`);
});

const shutdownHandler = async (signal) => {
  console.log(`Received signal '${signal}'. Shutting down servers.`);

  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Shutdown timed out')), 10000);
    });

    const httpClose = new Promise((resolve, reject) => {
      httpServer.close((err) => {
        if (err) reject(err);
        else {
          console.log('HTTP server closed.');
          resolve();
        }
      });
    });

    const httpsClose = new Promise((resolve, reject) => {
      httpsServer.close((err) => {
        if (err) reject(err);
        else {
          console.log('HTTPS server closed.');
          resolve();
        }
      });
    });

    await Promise.race([
      Promise.all([httpClose, httpsClose]),
      timeoutPromise
    ]);

    console.log('Exiting.');
    process.exit(0);

  } catch (error) {
    console.error('Error during shutdown:', error.message);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdownHandler);
process.on('SIGINT', shutdownHandler);
