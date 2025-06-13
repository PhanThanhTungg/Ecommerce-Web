const buttonAddBanner = document.querySelector('.button-add-banner');
if(buttonAddBanner) {
  buttonAddBanner.addEventListener('click', function(e) {
    e.preventDefault();
    const bannerArea = document.querySelector('.area-add-banner');
    bannerArea.classList.toggle('hidden');
  });
}

const buttonEditBanners = document.querySelectorAll('.button-edit-banner');
if(buttonEditBanners) {
  buttonEditBanners.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const editArea = button.parentElement.querySelector('.edit-area');
      console.log(editArea);
    });
  });
}