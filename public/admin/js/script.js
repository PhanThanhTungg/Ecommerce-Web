//active page
const items = document.querySelectorAll(".sider li");
if(items) {
  const href = String(window.location.href);
  if(href.includes("/admin/dashboard"))
    document.querySelector("[sider='Sider-Dashboard']").classList.add("active");
  else if(href.includes("/admin/products-category"))
    document.querySelector("[sider='Sider-Category']").classList.add("active");
  else if(href.includes("/admin/products"))
    document.querySelector("[sider='Sider-Product']").classList.add("active");
  else if(href.includes("/admin/orders"))
    document.querySelector("[sider='Sider-Order']").classList.add("active");
  else if(href.includes("/admin/roles/permissions"))
    document.querySelector("[sider='Sider-Permission']").classList.add("active");
  else if(href.includes("/admin/roles"))
    document.querySelector("[sider='Sider-Role']").classList.add("active");
  else if(href.includes("/admin/accounts"))
    document.querySelector("[sider='Sider-Account']").classList.add("active");
  else if(href.includes("/admin/users"))
    document.querySelector("[sider='Sider-User']").classList.add("active");
  else if(href.includes("/admin/settings/general"))
    document.querySelector("[sider='Sider-Setting']").classList.add("active");
}

//hover on avatar at header
const boxAvatar = document.querySelector(".header .name");
if(boxAvatar){
  const dropdown = boxAvatar.nextElementSibling;
  boxAvatar.addEventListener("mouseover",()=>{
    dropdown.classList.add("hover");
  })
  document.addEventListener("mouseover", e=>{
    if(!boxAvatar.contains(e.target) && !dropdown.contains(e.target)){
      dropdown.classList.remove("hover");
    }
    }
  )
}


// begin button fillter-status
const buttonStatus = document.querySelectorAll("[button-status]")
if (buttonStatus.length > 0) {
  let url = new URL(window.location.href) // hàm xử lí nhanh url
  buttonStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status")

      if (status) {
        url.searchParams.set("status", status)  // set param cho url
      }
      else {
        url.searchParams.delete("status") // xoa param 
      }

      window.location.href = url.href   // set url moi cho href
    })
  })
}
// end button status

//status-order
const buttonStatusOrders = document.querySelectorAll("[button-status-order]")
if (buttonStatusOrders.length > 0) {
  for (const buttonStatusOrder of buttonStatusOrders) {
    const formChangeStatusOrder = document.querySelector("#form-change-status-order")
    const path = formChangeStatusOrder.getAttribute("data-path")

    const itemSelected = buttonStatusOrder.getAttribute("optionSelected")
    const optionSelected = buttonStatusOrder.querySelector(`option[value='${itemSelected}']`)
    optionSelected.selected = true

    buttonStatusOrder.addEventListener("change", (e) => {
      const value = e.target.value
      const productId = buttonStatusOrder.getAttribute("product-id")
      const orderId = buttonStatusOrder.getAttribute("orderId")

      const action = path + `/${orderId}/${productId}/${value}?_method=PATCH`
      formChangeStatusOrder.action = action //~~ setAttribute
      formChangeStatusOrder.submit() // submit len url de be xu li
    })
  }
}


//begin form-search
const formSearch = document.querySelector("#form-search")


if (formSearch) {
  let url = new URL(window.location.href)

  formSearch.addEventListener("submit", (e) => { // submit là sự kiện khi người dùng click vào submit
    e.preventDefault()  // ngăn chặn xử lí mặc định của trình duyệt là load lại trang
    const keySearch = e.target.elements.keyword.value
    if (keySearch) {
      url.searchParams.set("keyword", keySearch)
    }
    else url.searchParams.delete("keyword")

    window.location.href = url.href
  })
}

//end form-search

//pagination
const buttonPaginations = document.querySelectorAll("[button-pagination]")
if (buttonPaginations) {
  let url = new URL(window.location.href)
  buttonPaginations.forEach(button => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination")

      url.searchParams.set("page", page)
      window.location.href = url.href
    })
  })
}
//end pagination

//checkBox multi
const checkBoxMulti = document.querySelector("[check-box-multi]")
if (checkBoxMulti) {
  const inputCheckAll = checkBoxMulti.querySelector("input[name='checkall']")
  const inputsId = checkBoxMulti.querySelectorAll("input[name='id']")
  if(inputCheckAll){
    inputCheckAll.addEventListener("click", () => {
      if (inputCheckAll.checked)
        inputsId.forEach(input => {input.checked = true})
      else 
        inputsId.forEach(input => {input.checked = false})
    })
  }
  inputsId.forEach(input => {
    input.addEventListener("click", () => {
      const countChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked").length
      inputCheckAll.checked = countChecked==inputsId.length?true:false;
    })
  })
}
//end checkBox multi

//form change multi
const formChangeMulti = document.querySelector('[form-change-multi]')
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault()
    const checkBoxMulti = document.querySelector("[check-box-multi]")
    const inputsChecked = checkBoxMulti.querySelectorAll("input[name ='id']:checked")

    const typeChange = e.target.elements.type.value
    if (typeChange == "delete-all") {
      const isConfirm = confirm("Bạn có chắc muốn xóa?")
      if (!isConfirm) return  
    }

    if (inputsChecked.length > 0) {
      let ids = []
      const inputIds = formChangeMulti.querySelector("input[name='ids']")

      inputsChecked.forEach(input => {
        const id = input.value

        if (typeChange == "change-position") {
          const position = input.closest(("tr")).querySelector("input[name='position']").value
          // closet: chon den the cha gan nhat

          ids.push(`${id}-${position}`)
        }
        else {
          ids.push(id)
        }
      })

      inputIds.value = ids.join(", ")
      formChangeMulti.submit()
    }
    else {
      alert("Quý khách vui lòng chọn ít nhất 1 bản ghi")
    }
  })
}

//end form change multi

//show alert cập nhật trạng thái thành công
const showAlert = document.querySelector("[show-alert]")
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"))

  setTimeout(() => {
    showAlert.classList.add("alert-hidden")
  }, time);

  const closeAlert = showAlert.querySelector("[close-alert]")
  closeAlert.onclick = () => {
    showAlert.classList.add("alert-hidden")
  }
}

// end show alert cập nhật trạng thái thành công

//upload-image-preview

const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", (e) => {
    console.log(e);
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}
//end-upload-image-preview

//sort
const sort = document.querySelector("[sort]")
if (sort) {
  let url = new URL(window.location.href)
  const sortSelect = sort.querySelector("[sort-select]")
  const sortClear = sort.querySelector("[sort-clear")

  sortSelect.addEventListener("change", (e) => {
    const value = e.target.value
    const [sortKey, sortValue] = value.split("-")

    url.searchParams.set("sortKey", sortKey)
    url.searchParams.set("sortValue", sortValue)

    window.location.href = url.href
  })
  // xoa sap xep
  sortClear.addEventListener("click", () => {
    url.searchParams.delete("sortKey")
    url.searchParams.delete("sortValue")

    window.location.href = url.href
  })

  // them selected cho option
  const sortKey = url.searchParams.get("sortKey")
  const sortValue = url.searchParams.get("sortValue")

  if (sortKey && sortValue) {
    const stringSort = `${sortKey}-${sortValue}`
    const optionSelected = document.querySelector(`option[value='${stringSort}']`)
    optionSelected.selected = true
  }
}
//end sort


//show password
const passField = document.querySelector(".input-password");
const showBtn = document.querySelector(".show-password i");
if (passField && showBtn) {
  showBtn.onclick = (() => {
    if (passField.type === "password") {
      passField.type = "text";
      showBtn.classList.add("hide-btn");
    } else {
      passField.type = "password";
      showBtn.classList.remove("hide-btn");
    }
  });
}







