const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // PUT /items/:id
    if (req.method === 'PUT' && pathname.startsWith('/items/')) {
        const id = Number(pathname.split('/')[2]);
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            let updates;

            try {
                updates = JSON.parse(body);
            } catch {
                res.statusCode = 400;
                return res.end('Invalid JSON');
            }

            const filePath = path.join(process.cwd(), 'data.json');

            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    return res.end('Internal Server Error');
                }

                let items = JSON.parse(data);
                const index = items.findIndex(item => item.id === id);

                if (index === -1) {
                    res.statusCode = 404;
                    return res.end('Item not found');
                }

                items[index] = {
                    ...items[index],
                    ...updates
                };

                fs.writeFile(
                    filePath,
                    JSON.stringify(items, null, 2),
                    (writeErr) => {
                        if (writeErr) {
                            res.statusCode = 500;
                            return res.end('Internal Server Error');
                        }

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(items[index]));
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