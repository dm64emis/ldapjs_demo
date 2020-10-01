const http = require('http');

const hostname = '127.0.0.1';
const port = 4000; // Open localhost:4000 in a browser to view

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, VS Code from WSL!!');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});