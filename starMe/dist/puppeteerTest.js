const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
let file = 'data.json';


let scrape = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({width: 800, height: 600});


  await page.goto('http://bizarre.kiev.ua/photo/');
  // await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img');
  // await page.click('html > body > nobr > font >a[1]');
  // body > table > tbody > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody > tr:nth-child(1) > td > font > b

  let frames = await page.frames();
  let listFrame = frames.find(f => f.name() === 'list');

  await listFrame.waitForSelector('a[href*="show=all"]');
  let showAllList = await listFrame.$('a[href*="show=all"]');

  await showAllList.click();
  await page.waitFor(2000);

  await listFrame.waitForSelector('nobr font a');
  const links = await listFrame.$$('nobr font a');

  console.log('count of accounts : ', links.length);

  let personsObjects = jsonfile.readFileSync(file) || [];
  // console.dir(jsonfile.readFileSync(file));
  let checked = jsonfile.readFileSync(file).map(el => el.link);
  for (let link = links.length - 1; link >= 0; link--) {
    // for (let link in links) {
    let personObject = {};
    let lnk = links[link];
    await lnk.click();

    let valueHandle = await links[link].getProperty('href');
    let currentHref = await valueHandle.jsonValue();
    let valueHandleText = await links[link].getProperty('innerText');
    let currentText = await valueHandleText.jsonValue();
    // console.log(currentHref, currentText);
    personObject.link = currentHref;
    personObject.nick = currentText;

    if (checked.indexOf(currentHref) > -1) {
      console.log('checked:', currentText);
    } else {
      await page.waitFor(1000);
      // person info frame
      let showFrame = await frames.find(f => f.name() === 'show');
      // open all comments
      let linkShowAll = await showFrame.$$('tr.dr td.sm b a');
      if (linkShowAll[0]) {
        await linkShowAll[0].click();
      }
      // get nick - reserve version
      let nickNameElement = await showFrame.$$('tbody tr td font ');
      let nickNameTextProperty = await nickNameElement[0].getProperty('innerText');
      let nickNameText = await nickNameTextProperty.jsonValue();
      nickNameText = nickNameText.replace(/::/gi, '');
      // console.log(nickNameText);


      // get link to social network
      // todo get all social networks
      let nickVkElements = await showFrame.$$('tbody tr td font b font a');
      personObject.social = [];
      if (nickVkElements.length > 0) {
        for (let i in nickVkElements) {
          let nickVkTextProperty = await nickVkElements[i].getProperty('href');
          let nickVkText = await nickVkTextProperty.jsonValue();
          personObject.social.push(nickVkText);
          // console.log(nickVkText);
        }
      }

      // get table with info about user
      await showFrame.waitForSelector('tr.tg td');
      let tableElements = await showFrame.$$('tr.tg td');
      personObject.rawInfo = {};
      for (let i = 0; i < tableElements.length / 2; i++) {
        let propElementCaption = await tableElements[i * 2];
        let propElementCaptionValue = await propElementCaption.getProperty('innerText');
        let propElementCaptionText = await propElementCaptionValue.jsonValue();

        let propElement = await tableElements[i * 2 + 1];
        let propElementValue = await propElement.getProperty('innerText');
        let propElementText = await propElementValue.jsonValue();

        personObject.rawInfo[propElementCaptionText] = propElementText;
        // console.log(propElementCaptionText, '\t[', propElementText, ']');

      }

      // subframes on persons page
      let showFrames = await showFrame.childFrames();

      //get bio caption
      let bioCaption;
      await showFrame.waitForSelector('td.tg  table  tbody  tr  td');
      let bioElements = await showFrame.$$('td.tg  table  tbody  tr  td');

      // console.log('bioElements[0]');
      bioCaption = await bioElements[0].asElement();

      let bioCaptionValue = await bioCaption.getProperty('innerText');
      let bioCaptionText = await bioCaptionValue.jsonValue();
      // console.log(bioCaptionText);
      //get bio data
      let bioFrame = await showFrames.find(f => f.name() === 'itxt');
      let bioElement = await bioFrame.$$('center');
      let bioElementValue = await bioElement[0].getProperty('innerText');
      let bioElementText = await bioElementValue.jsonValue();
      // console.log(bioElementText);
      personObject.rawInfo[bioCaptionText] = bioElementText;

      //get profile comments
      let commentElements = await showFrame.$$('tr.lh td.sm');
      let commentsPromises = [];
      for (let i in commentElements) {
        // console.log('commentElements [i]');
        commentsPromises.push(commentElements [i].asElement().getProperty('innerText').then(o => o.jsonValue()));
      }

      personObject.profileComments = [];
      for (let i in commentsPromises) {
        let commentText = await commentsPromises[i];
        let commentArray = commentText.replace(':', ';').replace('\n', ';').split(';');
        let commentObject = {};
        commentObject.author = commentArray[0];
        commentObject.text = commentArray[1];
        commentObject.time = commentArray[2];
        personObject.profileComments.push(commentObject);

      }


      let photoElements = await showFrame.$$('td.tg table tr td a');
      let photoHrefs = [];
      for (let i in photoElements) {
        let photoHref = await photoElements[i].asElement().getProperty('href').then(el => el.jsonValue());
        photoHrefs.push(photoHref);
      }
      personObject.photos = [];
      for (let i in photoHrefs) {
        console.log('photo # ', i);
        let photoObject = {};
        // console.log('photoElements[i]');
        photoObject.url = photoHrefs[i];
        console.log('photo href : ', photoObject.url);
        let photoPage = await browser.newPage();
        await photoPage.goto(photoObject.url);
        try {
          await photoPage.waitForSelector('tr.dr td.sm b a', {timeout:1000});
        }
        catch (err) {

        }
        let linkShowAll = await photoPage.$$('tr.dr td.sm b a');
        if (linkShowAll[0]) {
          await linkShowAll[0].click();
        }
        await photoPage.waitForSelector('tr td img[src*="_fok/+"]');
        let photoElement = await photoPage.$$('tr td img[src*="_fok/+"]');
        let photoElementHref = await photoElement[0].asElement().getProperty('src').then(el => el.jsonValue());
        photoObject.src = photoElementHref;
        //get photo comments
        photoObject.comments = [];
        let commentElements = await photoPage.$$('tr.lh td.sm');
        let commentsPromises = await commentElements.map(
          el => {
            return el
              .asElement()
              .getProperty('innerText')
              .then(o => o.jsonValue())
          });


        for (let i in commentsPromises) {
          let commentText = await commentsPromises[i];
          let commentArray = commentText.replace(':', ';').replace('\n', ';').split(';');
          let commentObject = {};
          commentObject.author = commentArray[0];
          commentObject.text = commentArray[1];
          commentObject.time = commentArray[2];
          // console.log(commentObject);
          photoObject.comments.push(commentObject);
          // personObject.profileComments.push(commentObject);
          // console.log();
        }
        // console.log(photoObject);
        await photoPage.close();
        await personObject.photos.push(photoObject);
      }
      console.log('\n--------------- NEW PERSON START --- [' + link + '] -------------------');
      console.log(JSON.stringify(personObject));
      console.log('--------------- NEW PERSON END --------------------\n');
      personsObjects.push(personObject);

      jsonfile.writeFileSync(file, personsObjects)


      // await page.waitFor(1500);
      // await page.screenshot({path: 'biz[' + link + '].png'});
    }

  }

  // const hrefs = await listFrame.evaluate(
  //   () => Array.from(document.body.querySelectorAll('nobr > font > a[href]'), ({href}) => href)
  // );
  // console.log(elemsToClick);
  console.log(JSON.stringify(personsObjects));


  page.close();
  await page.waitFor(3000);
  browser.close();
};

try {
  scrape()
}
catch (e) {
  console.log(e);
}

// .then(console.log)
// .catch(console.log);


// http://bizarre.kiev.ua/cgi-bin/photo/info.pl?n=%21%21%21HE%u041FOKOP%u0418MA%u042F%21%21%21

// http://bizarre.kiev.ua/cgi-bin/photo/show.pl?n=%21%21%21B%dbCOKA%df%e8%c3P%d3%c4ACTA%df01.jpg&s=F&p=ok&i=060105
// http://bizarre.kiev.ua/photo/_fok/+F_%21%21%21B%dbCOKA%df%e8%c3P%d3%c4ACTA%df01.jpg
// http://bizarre.kiev.ua/photo/_fok/+F_%21%21%21B%dbCOKA%df%e8%c3P%d3%c4ACTA%df05.jpg


//http://bizarre.kiev.ua/cgi-bin/photo/info.pl?n=%21%21%21%21%21%21%21%21%21%21%21%21%21Te%u0442%u044F%u043D%u043Aa
