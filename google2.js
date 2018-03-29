const puppeteer = require('puppeteer');
const cheerio = require('cheerio');


async function run(search) {
    console.log("running!")
    const searchUrl = "https://www.google.com/";
    const searchSelector = "#lst-ib";
    const searchedName = search;
    const searchSubmitBtn = '#tsf > div.tsf-p > div.jsb > center > input[type="submit"]:nth-child(1)';
    const resultsSelector = ".g > div > div.rc > h3.r > a";
    const resultsArray = [];

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(searchUrl);
   
    await page.click(searchSelector);
    await page.keyboard.type(searchedName);
    await page.click(searchSubmitBtn);
    await page.waitForNavigation();
    

    const bodyHandle = await page.$('body');
    const html = await page.evaluate(body => body.innerHTML, bodyHandle);
     await page.waitFor(2 * 1000); 

    function scrapeData(html) {

        const $ = cheerio.load(html);
        let element = $(".g").each(function (i, elem) {
            
            let resultsObj = {
                title: $(this).find(resultsSelector).text(),
                link: $(this).find(resultsSelector).attr("href"),
                other: $(this).find("div.slp.f").text()
            }

            resultsArray.push(resultsObj);
        });
        console.log(resultsArray);

        return Promise.resolve("resolved");
    }

    scrapeData(html);

    browser.close();
}

run("Eric Tenenbaum Linkedin Phoenix Arizona");