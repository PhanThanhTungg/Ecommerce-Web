import crawlHrefItem from './Action/crawlHrefItem.js';
import browser from './config/browser.config.js';
import {writeJson} from "./Action/fileHandle.js";
import crawDetailItem from './Action/crawDetailItem.js';


const main = async () => {
  const page = await browser.newPage();

  // const links = await crawlHrefItem(page,'https://www.dwr.com/storage-media?lang=en_US','.product-tile a.stretched-link');
  // await writeJson("./Data/living-room/MediaStorage/links.json", links);

  const Details = await crawDetailItem(page,'./Data/living-room/MediaStorage/links.json', '6814a40db600fbac90b72c7a');
  await writeJson("./Data/living-room/MediaStorage/datas.json", Details);

  await browser.close();
};

main().catch((error) => {
  console.error('Error:', error);
});
