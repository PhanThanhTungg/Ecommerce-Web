// format money
const moneyObject = document.querySelectorAll(".formatMoney")
moneyObject.forEach(item =>{
  const moneyN = Number(item.innerHTML.slice(0,-1))
  const moneyS = moneyN.toLocaleString('vi', {style : 'currency', currency : 'VND'})
  item.innerHTML = moneyS
})
