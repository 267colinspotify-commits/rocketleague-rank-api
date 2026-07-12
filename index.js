const express = require("express");
const { chromium } = require("playwright");

const app = express();

app.get("/", (req, res) => {
  res.send("Rocket League API läuft!");
});

let browser;

async function getBrowser() {
  if (!browser) {
    browser = await chromium.launch({
      headless: true
    });
  }
  return browser;
}


app.get("/rocketleague/:platform/:name", async (req, res) => {

  const platform = req.params.platform;
  const name = req.params.name;

  try {

    const browser = await getBrowser();
    const page = await browser.newPage();

    const url =
    `https://rocketleague.tracker.network/rocket-league/profile/${platform}/${name}/overview`;

    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 30000
    });


    const text = await page.locator("body").innerText();


    let rank = "Rank nicht gefunden";


    if(text.includes("Diamond III")){
      rank = "Diamond III";
    }

    if(text.includes("Champion I")){
      rank = "Champion I";
    }

    await page.close();

    res.send(rank);


  } catch(err){

    console.log(err);
    res.send("Fehler beim Abrufen");

  }

});


app.listen(process.env.PORT || 3000, () => {
 console.log("Rocket League API läuft");
});
