const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
let file = 'data.json';


let scrape = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({width: 2000, height: 1000});
  await page.goto('http://192.168.161.17/#/login');

  await page.waitForSelector('input[type="text"][name="userName"]');

  await page.type('input[type="text"][name="userName"]', 'saipadmin', {delay: 25});
  await page.type('input[type="password"][name="password"]', '12345678a', {delay: 25});
  await page.click('button[ng-click*="login"]', {delay: 100});
  await page.waitFor(5000);

  try {
    await page.goto('http://192.168.161.17/#/rulesGallery', {timeout: 1000});
  }
  catch (e) {
    console.log(e);
  }

  await page.waitForSelector('a[ng-click*="openRule"]', {delay: 1000});
  let a = await page.$$eval('a[ng-click*="openRule"]', aa => aa.map(a => a['innerText']));
  console.log(a);
  await page.click('a[ng-click*="openRule"]', {delay: 100});
  await page.waitFor(1000);
  await page.click('a[ng-click*="toggleList"]', {delay: 100});
  await page.waitFor(1000);
  await page.click('[ng-click*="selectItem"]', {delay: 100});



  await page.waitFor(3000);
  // browser.close()

};


scrape()
