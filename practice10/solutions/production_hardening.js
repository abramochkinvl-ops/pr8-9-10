const http = require('http');

const port = process.env.PORT || process.argv[2] || 3000;

// helper для заголовків безпеки + CORS
function setHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Access-Control-Allow-Origin', '*');
}

const server = http.createServer((req, res) => {
    setHeaders(res);

    const { method, url } = req;

    // OPTIONS /health (CORS preflight)
    if (method === 'OPTIONS' && url === '/health') {
        res.statusCode = 204;
        return res.end();
    }

    // GET /health
    if (method === 'GET' && url === '/health') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ ok: true }));
    }

    // GET /boom (simulate crash but keep server alive)
    if (method === 'GET' && url === '/boom') {
        try {
            throw new Error('Boom!');
        } catch (err) {
            res.statusCode = 500;
            return res.end('Internal Server Error');
        }
    }

    // fallback
    res.statusCode = 404;
    res.end('Not found');
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});