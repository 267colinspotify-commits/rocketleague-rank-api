const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.get("/rocketleague/:platform/:name", async (req, res) => {

    const player = req.params.name;
    const platform = req.params.platform;

    try {

        const url =
        `https://rocketleague.tracker.network/rocket-league/profile/${platform}/${player}/overview`;

        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const $ = cheerio.load(response.data);

        let rank = "kein Rang gefunden";

        $(".rank-title").each((i, el) => {
            const text = $(el).text().trim();

            if(text) {
                rank = text;
            }
        });

        res.send(rank);

    } catch(error) {

        console.log(error);
        res.send("Fehler");

    }

});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server läuft");
});
