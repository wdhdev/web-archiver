const fs = require("fs");

module.exports = async (req, res) => {
    const data = [];

    fs.readdir("archive-data", async function (err, files) {
        if(err) return res.status(500);

        files.forEach(function (file) {
            const fileData = require(`../../archive-data/${file}`);

            data.push(fileData);
        })

        res.status(200).json(data);
    })
}