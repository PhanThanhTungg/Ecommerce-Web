import crawlHrefItem from './Action/crawlHrefItem.js';
import browser from './config/browser.config.js';
import {writeJson} from "./Action/fileHandle.js";
import crawDetailItem from './Action/crawDetailItem.js';


const main = async () => {
  const page = await browser.newPage();

  // const links = await crawlHrefItem(page,'https://www.dwr.com/living-accent-coffee-tables?lang=en_US','.product-tile a.stretched-link');
  // await writeJson("./Data/living-room/coffee-table/links.json", links);

  const Details = await crawDetailItem(page,'./Data/living-room/coffee-table/links.json');
  await writeJson("./Data/living-room/coffee-table/datas.json", Details);
  console.log(Details);

  await browser.close();
};

main().catch((error) => {
  console.error('Error:', error);
});
