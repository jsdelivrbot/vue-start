const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
let file = 'data.json';

let getFullPageScreenshot = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({width: 800, height: 600});
  // await page.goto('https://geektimes.ru/post/295409/');
  await page.goto('https://2ch.hk/soc/');
  await page.waitFor(2500);

  let bodyDiv = await page.$('section.posts');
  let bodyBox = await bodyDiv.boundingBox();
  console.log(bodyBox);
  console.log(bodyBox.height);


  for (let h = 0; h < 10; h++) {
    await page.evaluate(_ => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitFor(1000);
  }




  let linksList = await page.$$eval('a[onclick*="expand"]', lnks => lnks.map(lnk => lnk.href));
  linksList = linksList.filter((v, i, a) => a.indexOf(v) === i);
  console.log(linksList);

  let linksThreadsList = await page.$$eval('a[href$=".html"][href*="res"]', lnks => lnks.map(lnk => lnk.href));
  linksThreadsList = linksThreadsList .filter((v, i, a) => a.indexOf(v) === i);
  console.log(linksThreadsList );

  await page.$$eval('a[class="postbtn-hide"', btns => btns.map(btn => btn.click()));


};


getFullPageScreenshot();
