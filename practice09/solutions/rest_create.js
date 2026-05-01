const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/items') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const filePath = path.join(process.cwd(), 'data.json');

            let newItem;

            try {
                newItem = JSON.parse(body);
            } catch {
                res.statusCode = 400;
                return res.end('Invalid JSON');
            }

            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    return res.end('Internal Server Error');
                }

                let items = [];

                try {
                    items = JSON.parse(data);
                } catch {
                    items = [];
                }

                items.push(newItem);

                fs.writeFile(
                    filePath,
                    JSON.stringify(items, null, 2),
                    (writeErr) => {
                        if (writeErr) {
                            res.statusCode = 500;
                            return res.end('Internal Server Error');
                        }

                        res.statusCode = 201;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(newItem));
                    }
                );
            });
        });

        return;
    }

    res.statusCode = 404;
    res.end('Not found');
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});