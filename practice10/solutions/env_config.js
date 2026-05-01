const http = require('http');

const port = process.env.PORT || process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.end('OK');
    }

    res.statusCode = 404;
    res.end('Not found');
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});