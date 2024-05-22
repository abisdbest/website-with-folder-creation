const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const ncp = require('ncp').ncp;

const app = express();
const port = process.env.PORT || 3000;
const templateDir = path.join(__dirname, 'template');

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/create-directory', (req, res) => {
    const dirName = req.body.directoryName;
    const dirPath = path.join(__dirname, dirName);

    if (!fs.existsSync(dirPath)) {
        ncp(templateDir, dirPath, (err) => {
            if (err) {
                return res.status(500).send('Error creating directory');
            }
            res.status(200).send(`Directory ${dirName} created successfully with template files.`);
        });
    } else {
        res.status(400).send(`Directory ${dirName} already exists.`);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
