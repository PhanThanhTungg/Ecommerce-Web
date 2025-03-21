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