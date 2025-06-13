//sort-order
const sortOrder = document.querySelector("[sort-order]")
if (sortOrder) {
  let url = new URL(window.location.href)
  const sortSelectOrder = sortOrder.querySelector("[sort-select-order]")
  const sortClearOrder = sortOrder.querySelector("[sort-clear-order]")

  sortSelectOrder.addEventListener("change", (e) => {
    const value = e.target.value
    const [sortKey, sortValue] = value.split("-")

    url.searchParams.set("sortKey", sortKey)
    url.searchParams.set("sortValue", sortValue)

    window.location.href = url.href
  })
  // xoa sap xep
  sortClearOrder.addEventListener("click", () => {
    url.searchParams.delete("sortKey")
    url.searchParams.delete("sortValue")

    window.location.href = url.href
  })

  // them selected cho option
  const sortKey = url.searchParams.get("sortKey")
  const sortValue = url.searchParams.get("sortValue")

  if (sortKey && sortValue) {
    const stringSort = `${sortKey}-${sortValue}`
    const optionSelected = sortSelectOrder.querySelector(`option[value='${stringSort}']`)
    optionSelected.selected = true
  }
}


//sort-user
function sortUser(sortBy) {
  console.log(sortBy);
  let url = new URL(window.location.href)
  let sortKey = url.searchParams.get("sortKey") || "rank";
  let sortValue = url.searchParams.get("sortValue") || "asc";

  if (sortBy == sortKey) {
    sortValue = sortValue === "asc" ? "desc" : "asc";
  } else {
    sortKey = sortBy;
    sortValue = "asc";
  }
  url.searchParams.set("sortKey", sortKey)
  url.searchParams.set("sortValue", sortValue)

  window.location.href = url.href
}


// change status order
const selectStatusOrders = document.querySelectorAll(".select-status-order");
if (selectStatusOrders) {
  const formChangeStatusOrder = document.querySelector(".form-change-status-order");
  selectStatusOrders.forEach(selectStatusOrder=>{
    selectStatusOrder.addEventListener("change", (e) => {
      const value = e.target.value
      const orderId = e.currentTarget.dataset.orderId;
      formChangeStatusOrder.action = `/admin/orders/change-status-order/${orderId}/${value}?_method=PATCH`;
      formChangeStatusOrder.submit();
    })
  })
}

//filter date
const formatDateInput = (date)=>{
  const dateSplit = date.split("/");
  return `${dateSplit[0]}${dateSplit[1]}${dateSplit[2]}`
}
const DecodeDateInput = (date)=>{
  if(!date) return null;
  return `${date.slice(0, 2)}/${date.slice(2, 4)}/${date.slice(4, 8)}`;
}
const filterDate = document.querySelector(".filter-date");
if(filterDate){
  const button = filterDate.querySelector("button");
  const url = new URL(window.location.href);
  const startDateValue = DecodeDateInput(url.searchParams.get("startDate"));
  const endDateValue = DecodeDateInput(url.searchParams.get("endDate"));
  filterDate.querySelector("#datepicker-range-start").value = startDateValue;
  filterDate.querySelector("#datepicker-range-end").value = endDateValue;
  
  button.addEventListener("click", (e) => {
    let startDate = formatDateInput(filterDate.querySelector("[name='start']").value);
    let endDate = formatDateInput(filterDate.querySelector("[name='end']").value);
    console.log(startDate, endDate);
    url.searchParams.set("startDate", startDate);
    url.searchParams.set("endDate", endDate);
    location.href = url.href;
  })
}