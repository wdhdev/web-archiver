const fs = require("fs");
const scrape = require("website-scraper");

module.exports = async (req, res) => {
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

        fs.writeFile(`archive-data/${uuid}.json`, `{"timestamp":"${Date.now()}","uuid":"${uuid}","website":"${req.body.url}"}`, function callback() {});

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
}
