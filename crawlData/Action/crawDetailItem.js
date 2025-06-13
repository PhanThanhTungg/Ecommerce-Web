import { readJson } from "./fileHandle.js";


export default async (page, linkFile, categoryId) => {
  const packageObj = await readJson(linkFile);

  const dataReturn = [];
  let i = 0;
  for (const link of packageObj) {
    if (i == Math.floor(Math.random()*1+30)) break;
    i++;
    await page.goto(link);
    const item = await page.evaluate(async (product_category_id) => {
      try {
        const title = document.querySelector(".product-name").innerText.trim();
        const discountPercentage = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
        let listSize = [];
        const sizeBox = document.querySelector("#attribute-accordion [data-attr='size']");
        let thumbnail;
        let images = [];
        let description;
        if (sizeBox) {
          if (!sizeBox.querySelector("#attr-size").classList.contains("show")) {
            sizeBox.querySelector("#attr-size").classList.add("show")
          }

          description = document.querySelector("#pdpSummaryGroup").innerHTML;

          const labels = sizeBox.querySelectorAll("label");
          for (const label of labels) {
            label.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
            const sizeName = label.querySelector("span.size-value").innerText.trim();

            const price = document.querySelector(".price .pricing-default .value").getAttribute("content");
            listSize.push({
              size: sizeName,
              price: +price * 26000,
              stock: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
            })
          };

          images = document.querySelectorAll("[role='tablist'] img");
          images = [...images].map(item => {
            let src = item.getAttribute("src");
            src = src.replace(/&w=\d+/, "&w=800");
            src = src.replace(/&h=\d+/, "&h=auto");
            return src;
          });
          thumbnail = images[0].replace(/&w=\d+/, "&w=90");
          return { title, product_category_id, description, listSize, discountPercentage, thumbnail, images };
        }
      } catch (error) {
        console.log("Error in evaluate:", error.message);
        return null;
      }
    }, categoryId);

    if (!item || item.listSize.length == 0) {
      i--;
      continue;
    }
    if (!item || item.images.length == 0) {
      i--;
      continue;
    }

    dataReturn.push(item);
  }

  return dataReturn;
}