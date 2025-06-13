fetch("./Data/living-room/coffee-table/datas.json")
.then(res=>res.json())
.then(data=>{
  const divTag = document.querySelector("div");
  divTag.innerHTML = data[1].description;
})