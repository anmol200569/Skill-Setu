import type { IncomingMessage, ServerResponse } from 'http';

let appInstance: any = null;

function getApp() {
  if (!appInstance) {
    const { createApp } = require('../apps/api/dist/app');
    appInstance = createApp();
  }
  return appInstance;
}

export default function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const app = getApp();
    return app(req, res);
  } catch (error: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'SERVERLESS_INITIALIZATION_ERROR',
        message: error?.message || String(error),
        stack: error?.stack,
        cwd: process.cwd()
      })
    );
  }
}
