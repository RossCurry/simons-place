import http from 'node:http';
import fs from 'node:fs/promises';
import { getLocalFiles, getUploadCareFiles } from './files.js';
import 'dotenv/config'

const server = http.createServer(async (req, res) => {
  console.log('req.url', req.url);

  const staticFiles = await fs.readdir(`./static/`);
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
      // const files = await fs.readFile(`./static/script.js`)
      // const files = await getLocalFiles();
      const files = await getUploadCareFiles();
      console.log('files.length', files.length)
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(files));
      break;
    }
    default:
      res.statusCode = 400;
      res.end(`Request url: ${req.url} - not recognised`);
      break;
  }
  // console.log('staticFiles', staticFiles)
  // const fileRequest = await fs.readFile(`./static/${req.url}`)
  // console.log(req)
  // res.end(JSON.stringify(files))
  res.end();
});

server.listen(process.env.PORT, `0.0.0.0`, () => {
  console.log('listening on port 3000');
});
