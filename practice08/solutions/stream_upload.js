const http = require('http');
const fs = require('fs');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/upload') {
        const writeStream = fs.createWriteStream('upload.txt');

        req.pipe(writeStream);

        req.on('end', () => {
            res.statusCode = 200;
            res.end('Uploaded');
        });

        req.on('error', () => {
            res.statusCode = 500;
            res.end('Request error');
        });

        writeStream.on('error', () => {
            res.statusCode = 500;
            res.end('Write error');
        });

        return;
    }

    res.statusCode = 404;
    res.end('Not found');
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});