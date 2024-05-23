// api/create-directory.js

const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const data = JSON.parse(body);
            const dirName = data.dirName;

            if (!dirName) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Directory name is required' }));
                return;
            }

            const dirPath = path.join(__dirname, '..', dirName);

            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
                res.statusCode = 200;
                res.end(JSON.stringify({ message: 'Directory created successfully' }));
            } else {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Directory already exists' }));
            }
        });
    } else {
        res.statusCode = 405;
        res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
};
