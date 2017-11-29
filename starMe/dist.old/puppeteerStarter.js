const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
let file = 'data.json';

let scrape = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({width: 800, height: 600});
  await page.goto('http://bizarre.kiev.ua/');


  await page.close();
  await browser.close();
};


scrape();
