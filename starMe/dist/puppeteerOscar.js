const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
let file = 'data.json';


let scrape = async (searchText) => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 768});
  await page.goto('http://192.168.167.208/oscar2/#/ed/gallery');
  // await page.goto('http://192.168.167.209/oscar2/#/ed/new');
  await page.waitFor(2000);


// try to found in table search text
  try {
    await page.waitForSelector('a[ui-sref*="ed_results"]');
    let result =
      await page.$$eval('a[ui-sref*="ed_results"]', els => els.map(el => {
        return {text: el.innerText, href: el.href.split('#')[1]}
      }));
    result = result.filter(res => res.text.includes(searchText));
    await page.waitForSelector('a[href*="'+ result[0].href +'"]');
    await page.click('a[href*="'+ result[0].href +'"]');
  }
// if not found add text to system by facebook id
  catch (e) {
    console.log(e);
    await page.waitFor(2000);
    await page.click('a[href*="new"]', {delay: 100});
    await page.waitFor(2000);
    await page.click('[data-target*="by-uid"]', {delay: 100});
    await page.waitFor(1000);
    await page.click('label [ng-change*="facebook"]', {delay: 100});
    await page.waitFor(1000);
    await page.click('md-input-container input[ng-model*="facebook"]', {delay: 100});
    await page.type('md-input-container input[ng-model*="facebook"]', searchText, {delay: 100});
    await page.waitFor(1000);
    await page.click('button#runSearchButton', {delay: 100});
    await page.waitFor(30000);
    await page.click('[ui-sref*="ed_results"]', {delay: 100});
  }

// try to reload page to get fresh results
  try {
    await page.waitForSelector('[ng-click*="reloadPage"]',{timeout:5000});
    await page.click('[ng-click*="reloadPage"]', {delay: 100});
  }
  catch (e) {
    console.log(new Date,'cannot reload page');
  }

// try to open details
  try {
    await page.waitForSelector('[ng-click*="showDetails"]',{timeout:5000});
    await page.$eval('[ng-click*="showDetails"]', el => el.click())
  }
  catch (e) {
    console.log(new Date,'user not ready');
  }


// click on menu of dictionary list
  try {
    await page.$eval('[ng-model*="selectedDictionary"]', el => el.click());
    page.keyboard.type('te\n');
  }
  catch (e){
    console.log(new Date,'dictionary not ready');
  }
  // await page.waitFor(3000);
  // // browser.close()

};

let searchText = 'mr_red';
scrape(searchText);
