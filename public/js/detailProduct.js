var swiper = new Swiper(".thumbnail-detail", {
  spaceBetween: 0,
  slidesPerView: "auto",
  freeMode: true,
  watchSlidesProgress: true,
});
var swiper2 = new Swiper(".image-detail", {
  spaceBetween: 0,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  thumbs: {
    swiper: swiper,
  },
});

const disableButton = () => {
  const btnSubmit = document.querySelector('.product-detail .formCart button');
  btnSubmit.disabled = true;
  setTimeout(() => {
    btnSubmit.disabled = false;
  }, 500)
}

const subQty = document.querySelector(".product-detail .formCart .sub");
const addQty = document.querySelector(".product-detail .formCart .add");
const inputQty = document.querySelector(".product-detail .formCart .stockInput");

subQty.addEventListener('click', function() {
  if(inputQty.value > 1) {
    inputQty.value = parseInt(inputQty.value) - 1;
  } else {
    inputQty.value = 1;
  }
});

addQty.addEventListener('click', function() {
  inputQty.value = parseInt(inputQty.value) + 1;
})