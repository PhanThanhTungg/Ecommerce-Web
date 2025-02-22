// change status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]")
if (buttonChangeStatus.length > 0) {

  const formChangeStatus = document.querySelector("#form-change-status")
  const path = formChangeStatus.getAttribute("data-path")


  buttonChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status")
      const id = button.getAttribute("data-id")

      let changeStatus = statusCurrent == "active" ? "inactive" : "active"

      const action = path + `/${changeStatus}/${id}?_method=PATCH`
      formChangeStatus.action = action //~~ setAttribute
      formChangeStatus.submit() // submit len url de be xu li
    })
  })
}
// end change status

//delete item
const buttonDelete = document.querySelectorAll("[button-delete]")
if (buttonDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item")
  const path = formDeleteItem.getAttribute("data-path")

  buttonDelete.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm")
      if (isConfirm) {
        const id = button.getAttribute("data-id")
        formDeleteItem.action = `${path}/${id}?_method=DELETE`
        formDeleteItem.submit()
      }
    })
  })
}
//end delete item

//add size
const buttonAddSize = document.querySelector(".buttonAddSize")
const buttonDelSize = document.querySelector(".buttonDelSize")
if (buttonAddSize) {
  buttonAddSize.addEventListener("click", () => {
    const tableSize = document.querySelector(".tableSize tbody")
    const tableData = tableSize.firstElementChild
    const firstRow = tableData.cloneNode(true)
    for (const item of firstRow.querySelectorAll("input")) {
      item.value = ""
    }
    tableSize.appendChild(firstRow)
  })
}
if(buttonDelSize){
  buttonDelSize.addEventListener("click", () => {
    const tableSize = document.querySelector(".tableSize tbody")
    const cnt = tableSize.querySelectorAll("tr").length
    if (cnt > 1) {
      const lastRow = tableSize.lastElementChild
      tableSize.removeChild(lastRow)
    }
  })
}




//end add size
