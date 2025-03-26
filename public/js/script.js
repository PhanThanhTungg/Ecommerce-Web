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



const headerSearchLabel = document.querySelector(".header-search__label");
if(headerSearchLabel){
  const headerSearchInput = document.querySelector(".header-search__input");
  headerSearchLabel.addEventListener("click", ()=>{
    headerSearchInput.classList.remove("d-none");
    headerSearchLabel.classList.add("d-none");
  })
  document.addEventListener("click", (e)=>{
    if(!headerSearchInput.contains(e.target) && !headerSearchLabel.contains(e.target) && !headerSearchInput.classList.contains("d-none")){
      headerSearchInput.classList.add("d-none");
      headerSearchLabel.classList.remove("d-none");
    }
      
  })
}


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


// responsive
const maxWidth767 = window.matchMedia('(max-width: 767px)');

function handleResize767(e) {
  const title = document.querySelectorAll('.footer .main-footer .title');
  const titleIcon = document.querySelectorAll('.footer .main-footer .title i');
  const content = document.querySelectorAll('.footer .main-footer .inner-content.wrapper-flex-column-gap-15');
  if (e.matches) {
    for(let i = 0; i < 4; i++) {
      title[i].setAttribute('data-toggle', 'collapse');
      title[i].setAttribute('role', 'button');
      title[i].setAttribute('data-target', `#collapse${i}`);
      title[i].setAttribute('aria-expanded', 'false');
      title[i].setAttribute('aria-controls', `collapse${i}`);

      content[i].classList.add('collapse');
      content[i].setAttribute('id', `collapse${i}`);
      
      titleIcon[i].classList.add('fi-rr-angle-down');
      $(content[i]).on("show.bs.collapse", function() {
        titleIcon[i].classList.remove('fi-rr-angle-down');
        titleIcon[i].classList.add('fi-rr-angle-up');
      })
      $(content[i]).on('hide.bs.collapse', function() {
        titleIcon[i].classList.remove('fi-rr-angle-up');
        titleIcon[i].classList.add('fi-rr-angle-down');
      })
    }
  } else {
    for(let i = 0; i < 4; i++) {
      title[i].removeAttribute('data-toggle');
      title[i].removeAttribute('role');
      title[i].removeAttribute('data-target');
      title[i].removeAttribute('aria-expanded');
      title[i].removeAttribute('aria-controls');
      titleIcon[i].classList.remove('fi-rr-angle-down');
      titleIcon[i].classList.remove('fi-rr-angle-up');

      content[i].classList.remove('collapse');
      content[i].removeAttribute('id');
    }
  }
}

maxWidth767.addEventListener('change', handleResize767);
handleResize767(maxWidth767);
  









