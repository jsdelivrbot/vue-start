const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
let file = 'data.json';


let scrape = async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1080});
  await page.goto('http://bizarre.kiev.ua/photo/');

  let frames = await page.frames();
  let listFrame = frames.find(f => f.name() === 'list');

  await listFrame.waitForSelector('a[href*="show=all"]');
  let showAllList = await listFrame.$('a[href*="show=all"]');
  await showAllList.click();

  await listFrame.waitForSelector('a[href*="list.pl?show=new"]');
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
      console.log('\n.:: NEW PERSON --- [' + link + '] --- [' + currentText + '] ::.');
      await page.waitFor(500);
      // person info frame
      let showFrame = await frames.find(f => f.name() === 'show');
      // open all comments

      try {
        //info.pl?n=ce%eape%f2ap%f8a_%e1%ebo%ed%e4%e8%ed%eaa&l=&sx=x&pg=-1
        //info.pl?n=ce%eape%f2ap%f8a_%e1%ebo%ed%e4%e8%ed%eaa&l=&sx=x&pg=0
        await showFrame.$eval('a[href*="pg=-1"]', showAll => showAll.click());
        await showFrame.waitForSelector('a[href*="pg=0"');
      }
      catch (err) {
        console.log('comments not present');
      }

      // get link to social network
      personObject.social = await showFrame.$$eval('tbody tr td font b font a', socialLinks => socialLinks.map(socialLink => socialLink.href));
      console.log('Social done : ' + JSON.stringify(personObject.social));


      personObject.rawInfo = {};
      // get table with info about user
      await showFrame.waitForSelector('tr.tg td');
      (await showFrame.$$eval('tr.tg', data => data.map(el=>el['innerText'])))
        .map(text => text.replace(':', '\u1060'))
        .map(text => text.replace('\t', ''))
        .map(text => text.split('\u1060'))
        .map(arr => {
          personObject.rawInfo[arr[0]] = arr[1]
        });


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
      console.log('Bio Done');

      //get profile comments
      showFrame.waitForSelector('tr.lh td.sm');
      let commentElements = [];
      try {
        commentElements = await showFrame.$$('tr.lh td.sm');
      }
      catch (error) {
        showFrame.waitForSelector('tr.lh td.sm');
        await page.screenshot({path: '!profileComments - biz[' + link + '].png'});
      }
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
      console.log('Comments Done');


      // profile photos
      let photoHrefs = [];
      showFrame.waitForSelector('a[href*="show.pl?n="]');
      try {
        photoHrefs = await showFrame.$$eval('a[href*="show.pl?n="]', imgs => {
          return imgs.map(img => img['href'])
        });
      } catch (err) {
        console.log('photos not found?');
        await page.screenshot({path: '!photos - biz[' + link + '].png'});
      }

      personObject.photos = [];
      for (let i in photoHrefs) {
        let photoObject = {};
        photoObject.url = photoHrefs[i];
        let photoPage = await browser.newPage();
        await photoPage.goto(photoObject.url);

        try {
          await photoPage.$eval('a[href*="pg=-1"]', showAll => showAll.click());
          await photoPage.waitForSelector('a[href*="pg=0"');
        }
        catch (err) {
          console.log('comments not present');
        }

        await photoPage.waitForSelector('img[src*="_fok/+"]');
        photoObject.src = await photoPage.$eval('img[src*="_fok/+"]', photo => photo['src']);


        //get photo comments
        photoObject.comments = [];
        (await photoPage.$$eval('tr.lh td.sm', comments => comments.map(comment => comment['innerText'])))
          .map(text => {
            // console.log(text);
            let commentArray = text.replace(':', ';').replace('\n', ';').split(';');
            let commentObject = {};
            commentObject.author = commentArray[0];
            commentObject.text = commentArray[1];
            commentObject.time = commentArray[2];
            photoObject.comments.push(commentObject);
          });

        // console.log(photoObject);
        await photoPage.close();
        await personObject.photos.push(photoObject);
        console.log('photo # ', i, 'Done');
      }


      console.log('--------------- NEW PERSON END --------------------\n');
      personsObjects.push(personObject);

      jsonfile.writeFileSync(file, personsObjects, {spaces: 1})


      // await page.waitFor(1500);
      // await page.screenshot({path: 'biz[' + link + '].png'});
    }

  }

  // const hrefs = await listFrame.evaluate(
  //   () => Array.from(document.body.querySelectorAll('nobr > font > a[href]'), ({href}) => href)
  // );
  // console.log(elemsToClick);
  // console.log(JSON.stringify(personsObjects));


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


//http://bizarre.kiev.ua/cgi-bin/photo/info.pl?n=%21%21%21%21%21%21%21%21%21%21%21%21%21Te%u0442%u044F%u043D%u043Aa
