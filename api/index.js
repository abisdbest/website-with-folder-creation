const express = require('express');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Promisify fs functions
const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);

// Handle form submission
app.post('/create-directory', async (req, res) => {
    const directoryName = req.body.directoryName;
    const templatePath = path.join(__dirname, 'template');
    const newDirectoryPath = path.join(__dirname, 'public', directoryName);

    // Check if the directory already exists
    if (fs.existsSync(newDirectoryPath)) {
        res.status(400).send('Directory already exists!');
        return;
    }

    try {
        // Create new directory
        await mkdir(newDirectoryPath);

        // Copy contents of the template directory to the new directory
        const files = await readdir(templatePath);
        for (const file of files) {
            const sourcePath = path.join(templatePath, file);
            const destinationPath = path.join(newDirectoryPath, file);
            await copyFile(sourcePath, destinationPath);
        }

        res.send('Directory created successfully at ' + directoryName + "!");
    } catch (error) {
        res.status(500).send('Error creating directory!');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
