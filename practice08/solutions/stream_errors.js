const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'GET' && url.pathname === '/missing-file') {
        const fileName = url.searchParams.get('fileName');

        if (!fileName) {
            res.statusCode = 400;
            return res.end('fileName is required');
        }

        const filePath = path.join(process.cwd(), fileName);

        const readStream = fs.createReadStream(filePath);

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');

        readStream.on('error', () => {
            if (!res.headersSent) {
                res.statusCode = 500;
                res.end('Internal Server Error');
            }
        });

        readStream.pipe(res);

        return;
    }

    res.statusCode = 404;
    res.end('Not found');
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});