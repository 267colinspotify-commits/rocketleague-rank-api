const express = require("express");
const { chromium } = require("playwright");

const app = express();

app.get("/", (req, res) => {
  res.send("Rocket League API läuft!");
});


app.get("/rocketleague/:platform/:name", async (req, res) => {

  const platform = req.params.platform;
  const name = req.params.name;

  let browser;

  try {

    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox"
      ]
    });

    const page = await browser.newPage();

    const url =
    `https://rocketleague.tracker.network/rocket-league/profile/${platform}/${name}/overview`;

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });


    await page.waitForTimeout(5000);


    const body = await page.locator("body").innerText();


    let rank = "Rank nicht gefunden";


    if(body.includes("Diamond III")) {
      rank = "Diamond III";
    }


    if(body.includes("Champion I")) {
      rank = "Champion I";
    }


    await browser.close();


    res.send(rank);


  } catch(error) {

    console.log(error);

    if(browser) {
      await browser.close();
    }

    res.send("Fehler beim Abrufen: " + error.message);

  }

});


app.listen(process.env.PORT || 3000, () => {
  console.log("Rocket League API läuft");
});
