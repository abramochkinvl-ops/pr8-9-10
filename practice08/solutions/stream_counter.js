const http = require('http');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/count') {
        let bytes = 0;
        let chunks = 0;

        req.on('data', (chunk) => {
            chunks += 1;
            bytes += chunk.length;
        });

        req.on('end', () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ bytes, chunks }));
        });

        req.on('error', () => {
            res.statusCode = 500;
            res.end('Request error');
        });

        return;
    }

    res.statusCode = 404;
    res.end('Not found');
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});