const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

let scrape = async() => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.setViewport({width: 800, height: 20000});
  
  
  await page.goto('http://bizarre.kiev.ua/photo/');
  // await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img');
  // await page.click('html > body > nobr > font >a[1]');
  // body > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(1) > td > font > b
  
  let frames = await page.frames();
  let listFrame = frames.find(f => f.name() === 'list');
  const links = await listFrame.$$('nobr font a');
  for (let link in links) {
    await links[link].click();
    await page.waitFor(1000);
    let valueHandle = await links[link].getProperty('href');
    let currentHref = await valueHandle.jsonValue();
    let valueHandleText = await links[link].getProperty('innerText');
    let currentText = await valueHandleText.jsonValue();
    console.log(currentHref, currentText);
    
    
    let showFrame = await frames.find(f => f.name() === 'show');
    let linkShowAll = await showFrame.$$('tr.dr td.sm b a');
    if (linkShowAll[0]) {
      await linkShowAll[0].click();
    }
    
    
    let nickNameElement = await showFrame.$$('tbody tr td font ');
    let nickNameTextProperty = await nickNameElement[0].getProperty('innerText');
    let nickNameText = await nickNameTextProperty.jsonValue();
    nickNameText = nickNameText.replace(/::/gi,'');
    console.log(nickNameText);
    
    let nickVkElements = await showFrame.$$('tbody tr td font b font a');
    if (nickVkElements.length > 0) {
      let nickVkTextProperty = await nickVkElements[0].getProperty('href');
      let nickVkText = await nickVkTextProperty.jsonValue();
      console.log(nickVkText);
    }
    
    
    let tableElements = await showFrame.$$('tr.tg td');
    for (let i = 0; i < tableElements.length / 2; i++) {
      let propElementCaption = await tableElements[i * 2];
      let propElementCaptionValue = await propElementCaption.getProperty('innerText');
      let propElementCaptionText = await propElementCaptionValue.jsonValue();
      
      let propElement = await tableElements[i * 2 + 1];
      let propElementValue = await propElement.getProperty('innerText');
      let propElementText = await propElementValue.jsonValue();
      console.log(propElementCaptionText, '\t[', propElementText, ']');
      
      
      // let tableElementsProperties = await tableElements[i].getProperty('innerText');
      // let tableElementText = await tableElementsProperties.jsonValue();
      // console.log(tableElementText);
    }
    
    
    // let nickName = await nickNameElement[0].getProperty('innerText');
    // console.log(nickName);
    
    
    await page.waitFor(3000);
    // await page.screenshot({path: 'biz[' + link + '].png'});
    
    
  }
  
  // const hrefs = await listFrame.evaluate(
  //   () => Array.from(document.body.querySelectorAll('nobr > font > a[href]'), ({href}) => href)
  // );
  // console.log(elemsToClick);
  page.close();
  await page.waitFor(3000);
  browser.close();
};

scrape()
// .then(console.log)
// .catch(console.log);


// http://bizarre.kiev.ua/cgi-bin/photo/info.pl?n=%21%21%21HE%u041FOKOP%u0418MA%u042F%21%21%21

// http://bizarre.kiev.ua/cgi-bin/photo/show.pl?n=%21%21%21B%dbCOKA%df%e8%c3P%d3%c4ACTA%df01.jpg&s=F&p=ok&i=060105
// http://bizarre.kiev.ua/photo/_fok/+F_%21%21%21B%dbCOKA%df%e8%c3P%d3%c4ACTA%df01.jpg
// http://bizarre.kiev.ua/photo/_fok/+F_%21%21%21B%dbCOKA%df%e8%c3P%d3%c4ACTA%df05.jpg
