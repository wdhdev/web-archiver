const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

const fs = require("fs");
const scrape = require("website-scraper");

require("dotenv").config();

app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

if(!fs.existsSync(`${__dirname}/archives`)) fs.mkdirSync(`${__dirname}/archives`);
if(!fs.existsSync(`${__dirname}/archive-data`)) fs.mkdirSync(`${__dirname}/archive-data`);

// Host public files
app.use(express.static(__dirname + "/public", {
    extensions: ["html"]
}))

// Host archives
app.use("/archive", express.static(__dirname + "/archives"));

app.post("/api/archive", async (req, res) => {
    if(!req.headers.password) return res.status(401).json({ "message": "No password provided.", "code": "NO_PASSWORD" });
    if(req.headers.password !== process.env.password) return res.status(401).json({ "message": "The password provided was incorrect.", "code": "INCORRECT_PASSWORD" });

    if(!req.body.url) return res.status(400).json({ "message": "No URL was provided.", "code": "NO_URL" });

    const uuid = require("crypto").randomUUID();

    const options = {
        urls: [`${req.body.url}`],
        directory: `archives/${uuid}`
    }

    try {
        await scrape(options);

        fs.writeFile(`archive-data/${uuid}.json`, `{"timestamp":"${Date.now()}","uuid":"${uuid}","website":"${req.body.url}"}`);

        res.status(200).json({
            "message": "The website has been archived.",
            "code": "WEBSITE_ARCHIVED",
            "website": req.body.url,
            "uuid": uuid,
            "url": `https://web.wharchive.org/archive/${uuid}`
        })
    } catch(err) {
        res.status(500).json({ "message": "A server error occurred.", "code": "SERVER_ERROR" });
    }
})

app.get("/api/archives", async (req, res) => {
    let data = [];

    fs.readdir("archive-data", async function (err, files) {
        if(err) return res.status(500);

        files.forEach(function (file) {
            const fileData = require(`./archive-data/${file}`);

            data.push(fileData);
        })

        res.status(200).json(data);
    })
})

// Start
app.listen(process.env.port, () => console.log(`[SERVER] Listening on Port: ${process.env.port}`));
