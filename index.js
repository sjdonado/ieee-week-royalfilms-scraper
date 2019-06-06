const puppeteer = require('puppeteer');

const link = 'https://royal-films.com/cartelera/barranquilla';
const movieName = 'endgame';

const init = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(link, { 'waitUntil': 'networkidle0' });

  const results = await page.evaluate(async (movieName) => {
    const titlesSelector = '#movies > div > div > div > div > div > a > span.info > h3';
    const titles = document.querySelectorAll(titlesSelector);

    const target = [...titles].find(title => title.innerText.toLowerCase().includes(movieName.toLowerCase()));

    if (target) {
      target.click();
      await new Promise(res => setTimeout(res, 5000));
      window.scrollTo(0, 1000);

      const movieTimesSelector = 'a.cursor-pointer.badge.badge-dark';
      const movieTimes = document.querySelectorAll(movieTimesSelector);

      return [...movieTimes].map(movieTime => movieTime.innerText);
    } else {
      return 'Not found :(';
    }
  }, movieName);

  await page.screenshot({ path: `${movieName}.png`});

  console.log('results', results);

  await browser.close();
}

init();