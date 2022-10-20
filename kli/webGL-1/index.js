const express = require("express")
const fs = require("fs")
const app = express()
const PORT = 3000

app.use(express.static('static'))
app.use(express.static('static/pages')) 

app.get("/pages", function (req, res) {
    fs.readdir(`${__dirname}/static/pages`,function (err, files) {
        if (err) {
            return console.log(err);
        }
        res.setHeader('content-type', 'application/json');
        res.send(files)
    });
})

app.listen(PORT, () => {
    console.log("Start serwera")
})