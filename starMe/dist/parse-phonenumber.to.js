const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
let file = 'data.json';

let scrape = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({width: 800, height: 600});

  let items = [];
  for (let i = 1; i <= 3; i++) {
    await page.goto('http://phonenumber.to/comments/' + i);
    (await page.$$eval('div[class="comment_phone"] a[itemprop="discusses"]', items => items.map(item => item.href))).map(href => items.push(href))

  }

  console.log(items);

  //div[class="comment_phone"] a[itemprop="discusses"]


  // await page.close();
  // await browser.close();
};


scrape();
