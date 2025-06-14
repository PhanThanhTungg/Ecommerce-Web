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

// format money
const spanMoney = document.querySelectorAll(".format-money");
if(spanMoney.length){
  spanMoney.forEach(span=>{
    const money = span.innerText.replace(/\./g, "").replace(/,/g, "");
    span.innerText = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(money);
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
  

// search product
const searchInput = document.getElementById("header-search__input");
const displayResult = document.querySelector('.header-search__result-content')
const displayResultWrapper = document.querySelector('.header-search__result')

if (searchInput) {
  searchInput.addEventListener("input", (e)=>{
    let keyword = e.target.value;
    if (keyword.length === 0) {
      displayResultWrapper.classList.remove("active")
    } else {
      displayResultWrapper.classList.add("active")
    }
    if (keyword.length > 3) {
      fetch(`/api/products/search/${keyword}`)
      .then(res=>res.json())
      .then(data=>{
        console.log(data);
        if (data.message === "success") {
          if (data.data.length === 0) {
            displayResult.innerHTML = `
              <div class="no-result">
                <p>No product found</p>
              </div>
            `
          }
          else {
            displayResult.innerHTML = ""
            data.data.forEach(item => {
              displayResult.innerHTML += `
                <a class="header-search__result-item" href="/products/detail/${item.slug}">
                  <div class="inner-image">
                    <img alt="${item.title}" src="${item.thumbnail}">
                  </div>
                  <div class="header-search__result-item-name">
                    <p>${item.title}</p>
                  </div>
                </a>
              `
            })
          }
        } else {
          displayResult.innerHTML = ""
        }
      })
      .catch(err=>{
        console.log(err);
      })
    }
  })
}







