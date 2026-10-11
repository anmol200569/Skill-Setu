import type { IncomingMessage, ServerResponse } from 'http';
import path from 'path';

// Ensure @skill-setu/shared resolves in Vercel serverless environment
try {
  const Module = require('module');
  const originalResolveFilename = Module._resolveFilename;
  const sharedDistPath = path.resolve(__dirname, '../packages/shared/dist/index.js');
  Module._resolveFilename = function (request: string, parent: any, isMain: boolean, options: any) {
    if (request === '@skill-setu/shared') {
      return sharedDistPath;
    }
    return originalResolveFilename.call(this, request, parent, isMain, options);
  };
} catch {
  // Ignored if module hook not allowed
}

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
