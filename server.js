// import exress
const express = require('express');
// start express
const app = express();
// folder build
const appName = 'crypto-app';
// builg generate files
const outputPath = `${__dirname}/dist/${appName}`;

//setter folder of build of content angular
app.use(express.static(outputPath));
//redirect requests of index
app.get('/*', (req, res) => {
    res.sendFile(`${outputPath}/index.html`);
});
//listen port heroku
app.listen(process.env.PORT);