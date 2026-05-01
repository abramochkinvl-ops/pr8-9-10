const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/items') {
        const filePath = path.join(process.cwd(), 'data.json');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                return res.end('Internal Server Error');
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
        });

        return;
    }

    res.statusCode = 404;
    res.end('Not found');
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});