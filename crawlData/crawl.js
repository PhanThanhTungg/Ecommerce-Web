import crawlHrefItem from './Action/crawlHrefItem.js';
import browser from './config/browser.config.js';
import {writeJson} from "./Action/fileHandle.js";
import crawDetailItem from './Action/crawDetailItem.js';


const main = async () => {
  const page = await browser.newPage();

  const mainCategoryName = 'Entryway Furniture'

  const CategoryLink = 'https://www.dwr.com/entryway-coat-racks-wall-hooks?lang=en_US';
  const categoryId = '6814da44e8a3f3a300e648f3';
  const categoryName = 'Coat Racks & Wall Hooks'

  const links = await crawlHrefItem(page, CategoryLink,'.product-tile a.stretched-link');
  await writeJson(`./Data/${mainCategoryName}/${categoryName}/links.json`, links);

  // const Details = await crawDetailItem(page,`./Data/${mainCategoryName}/${categoryName}/links.json`, categoryId);
  // await writeJson(`./Data/${mainCategoryName}/${categoryName}/datas.json`, Details);

  await browser.close();
};

main().catch((error) => {
  console.error('Error:', error);
});
