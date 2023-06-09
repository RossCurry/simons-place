import http from 'node:http';
import fs from 'node:fs/promises';
import { getLocalFiles, getUploadCareFiles } from './files.js';
import 'dotenv/config'

const server = http.createServer(async (req, res) => {
  console.info('req.url', req.url);

  switch (req.url) {
    case '/': {
      const html = await fs.readFile(`./static/index.html`);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(html);
      break;
    }
    case '/style.css': {
      const css = await fs.readFile(`./static/style.css`);
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.write(css);
      break;
    }
    case '/script.js': {
      const script = await fs.readFile(`./static/script.js`);
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.write(script);
      break;
    }

    case '/files': {
      // const files = await getLocalFiles();
      const files = await getUploadCareFiles();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(files));
      break;
    }
    default:
      res.statusCode = 400;
      res.end(`Request url: ${req.url} - not recognised`);
      break;
  }
  res.end();
});

server.listen(process.env.PORT, `0.0.0.0`, () => {
  console.info(`listening on port: ${process.env.PORT}`);
});
