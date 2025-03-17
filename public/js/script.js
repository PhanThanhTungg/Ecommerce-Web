const refreshToken = ()=>{
  fetch("/api/user/refresh",{
    method: "POST"
  }).then(res=>res.json())
  .then(data=>{
    console.log(data);
  }).catch(err=>{
    console.log(err);
  })
}
refreshToken();
setInterval(refreshToken, 50000);



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
// const sort = document.querySelector("[sort]")
// if (sort) {
//   let url = new URL(window.location.href)
//   const sortSelect = sort.querySelector("[sort-select]")
//   const sortClear = sort.querySelector("[sort-clear")

//   sortSelect.addEventListener("change", (e) => {
//     const value = e.target.value
//     const [sortKey, sortValue] = value.split("-")

//     url.searchParams.set("sortKey", sortKey)
//     url.searchParams.set("sortValue", sortValue)

//     window.location.href = url.href
//   })
//   // xoa sap xep
//   sortClear.addEventListener("click", () => {
//     url.searchParams.delete("sortKey")
//     url.searchParams.delete("sortValue")

//     window.location.href = url.href
//   })

//   // them selected cho option
//   const sortKey = url.searchParams.get("sortKey")
//   const sortValue = url.searchParams.get("sortValue")

//   if (sortKey && sortValue) {
//     const stringSort = `${sortKey}-${sortValue}`
//     const optionSelected = document.querySelector(`option[value='${stringSort}']`)
//     optionSelected.selected = true
//   }
// }
//end sort

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








