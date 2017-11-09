const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
let browser;
let file = 'data.json';


let scrape = async (searchText, filterNames, browser) => {
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 768});
  await page.goto('http://192.168.167.211/oscar2/#/ed/gallery');
  // await page.goto('http://192.168.167.209/oscar2/#/ed/new');
  await page.waitFor(2000);


// try to found in table search text
  try {
    await page.waitForSelector('a[ui-sref*="ed_results"]', {timeout: 5000});
    let result =
      await page.$$eval('a[ui-sref*="ed_results"]', els => els.map(el => {
        return {text: el.innerText, href: el.href.split('#')[1]}
      }));
    result = result.filter(res => res.text.includes(searchText));
    await page.waitForSelector('a[href*="' + result[0].href + '"]');
    await page.click('a[href*="' + result[0].href + '"]');
  }
// if not found add text to system by facebook id
  catch (e) {
    // console.log(e);
    console.log(new Date, searchText, 'Not found in list - creating new');

    await page.waitForSelector('a[href*="new"]', {timeout: 5000});
    await page.click('a[href*="new"]', {delay: 100});

    await page.waitForSelector('[data-target*="by-uid"]', {timeout: 5000});
    await page.click('[data-target*="by-uid"]', {delay: 100});

    await page.waitForSelector('label [ng-change*="facebook"]', {timeout: 5000});
    await page.click('label [ng-change*="facebook"]', {delay: 100});

    await page.waitForSelector('md-input-container input[ng-model*="facebook"]', {timeout: 5000});
    await page.click('md-input-container input[ng-model*="facebook"]', {delay: 100});
    await page.type('md-input-container input[ng-model*="facebook"]', searchText, {delay: 100});


    await page.waitForSelector('button#runSearchButton', {timeout: 5000});
    await page.click('button#runSearchButton', {delay: 100});

    await page.waitFor(120000);
    await page.click('[ui-sref*="ed_results"]', {delay: 100});
  }

// try to reload page to get fresh results
  try {
    await page.waitForSelector('[ng-click*="reloadPage"]', {timeout: 5000});
    await page.click('[ng-click*="reloadPage"]', {delay: 100});
  }
  catch (e) {
    console.log(new Date, searchText, 'cannot reload page');
  }

// try to open details
  try {
    await page.waitForSelector('[ng-click*="showDetails"]', {timeout: 5000});
    await page.$eval('[ng-click*="showDetails"]', el => el.click())
  }
  catch (e) {
    console.log(new Date, searchText, 'user not ready');
  }


// click on menu of dictionary list
  try {
    let selector = '[ng-change="$ctrl.dictionaryPicked(line)"]';
    let checkBoxSelector = '[ng-click="$ctrl.toggleAll()"]';
    let execSelector = '[ng-click="$ctrl.execute(block, line)"]';

    await page.waitForSelector(selector, {timeout: 10000});
    // page.focus(selector);
    for (let i in filterNames) {
      await page.click(selector);
      await page.type(selector, filterNames[i] + '\n', {delay: 100});
      await page.click(selector);
      await page.waitFor(1500);
    }
    await page.waitFor(1500);
    await page.waitForSelector(checkBoxSelector, {timeout: 10000});
    await page.$$eval(checkBoxSelector, chs => chs.map(ch => ch.click()));
    await page.waitFor(15000);
    await page.waitForSelector(execSelector, {timeout: 10000});
    await page.click(execSelector);
  }
  catch (e) {
    console.log(new Date, searchText, 'dictionary not ready');
  }
  // await page.waitFor(3000);
  // // browser.close()

};

let searchTexts = ['abdullah', 'belmondo', 'rotveller'];
let filterNames = ['social', 'isis', 'qa', 'cy', 'new'];
let starter = async (searchTexts) => {
  let browser = await puppeteer.launch({headless: false});
  for (let j in searchTexts) {
    scrape(searchTexts[j], filterNames, browser);
  }
};

starter(searchTexts);
