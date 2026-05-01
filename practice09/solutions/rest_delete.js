const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // DELETE /items/:id
    if (req.method === 'DELETE' && pathname.startsWith('/items/')) {
        const id = Number(pathname.split('/')[2]);
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

            items.splice(index, 1);

            fs.writeFile(
                filePath,
                JSON.stringify(items, null, 2),
                (writeErr) => {
                    if (writeErr) {
                        res.statusCode = 500;
                        return res.end('Internal Server Error');
                    }

                    res.statusCode = 200;
                    res.end('Deleted successfully');
                }
            );
        });

        return;
    }

    res.statusCode = 404;
    res.end('Not found');
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});