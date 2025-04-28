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
//end sort-order

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
//end sort-user