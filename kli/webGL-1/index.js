const express = require("express")
const app = express()
const PORT = 3000

app.use(express.static('static'))
app.use(express.static('static/pages')) 

app.get("/pages", function (req, res) {
    fs.readdir(__dirname, function (err, files) {
        if (err) {
            return console.log(err);
        }
        console.log(files)
    });
    res.send("supcio")
})

app.listen(PORT, () => {
    console.log("Start serwera")
})