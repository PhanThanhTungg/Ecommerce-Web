const itemSelected = document.querySelector("select[name ='sex']").getAttribute("optionSelected")
if(itemSelected){
  const select = document.querySelector(`option[value='${itemSelected}']`)
  select.selected = true
}