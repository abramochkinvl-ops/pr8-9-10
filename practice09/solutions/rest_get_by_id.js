const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // GET /items/:id
    if (req.method === 'GET' && pathname.startsWith('/items/')) {
        const id = Number(pathname.split('/')[2]);

        const filePath = path.join(process.cwd(), 'data.json');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                return res.end('Internal Server Error');
            }

            const items = JSON.parse(data);
            const item = items.find(i => i.id === id);

            if (!item) {
                res.statusCode = 404;
                return res.end('Item not found');
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(item));
        });

        return;
    }

    res.statusCode = 404;
    res.end('Not found');
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});