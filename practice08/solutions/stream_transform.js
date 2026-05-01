const http = require('http');
const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'GET' && url.pathname === '/upper') {
        const fileName = url.searchParams.get('fileName');

        if (!fileName) {
            res.statusCode = 400;
            return res.end('fileName is required');
        }

        const filePath = path.join(process.cwd(), fileName);

        if (!fs.existsSync(filePath)) {
            res.statusCode = 400;
            return res.end('File not found');
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');

        const upperCaseTransform = new Transform({
            transform(chunk, encoding, callback) {
                callback(null, chunk.toString().toUpperCase());
            }
        });

        fs.createReadStream(filePath)
            .pipe(upperCaseTransform)
            .pipe(res);

        return;
    }

    res.statusCode = 404;
    res.end('Not found');
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});