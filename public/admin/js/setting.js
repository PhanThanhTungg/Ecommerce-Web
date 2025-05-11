const buttonAddBanner = document.querySelector('.button-add-banner');
if(buttonAddBanner) {
  buttonAddBanner.addEventListener('click', function(e) {
    e.preventDefault();
    const bannerArea = document.querySelector('.area-add-banner');
    bannerArea.classList.toggle('hidden');
  });
}