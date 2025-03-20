const rating_wrappers = document.querySelectorAll(".inner-rating");
if(rating_wrappers){
  rating_wrappers.forEach(rating=>{
    const ratingNumber = rating.dataset.rating;
    const ratingInput = rating.querySelector(`input[value="${ratingNumber}"]`);
    ratingInput.checked = true;
  })
}
