import { readJson } from "./fileHandle.js";


export default async (page, linkFile) => {
  const packageObj = await readJson(linkFile);

  const dataReturn = [];
  let i = 0;

  for (const link of packageObj) {
    i++; if (i > 8) break;
    await page.goto(link);
    const item = await page.evaluate(async () => { 
      const title = document.querySelector(".product-name").innerText.trim();

      let listSize = [];
      const sizeBox = document.querySelector("[data-attr='size']");
      if(sizeBox){
        if(!sizeBox.querySelector("#attr-size").classList.contains("show")){
          sizeBox.querySelector("#attr-size").classList.add("show")
        } 
        const labels = sizeBox.querySelectorAll("label");
        for(const label of labels) {
          label.click();
          await new Promise(resolve => setTimeout(resolve, 2000));
          const sizeName = label.querySelector("span.size-value").innerText.trim();
          const price = document.querySelector(".price .pricing-default .value").getAttribute("content");
          listSize.push({
            sizeName,
            price,
            stock: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
          })
        };
      }
      return {title, listSize};
    });

    dataReturn.push(item);
  }

  return dataReturn;
}