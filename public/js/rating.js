const rating_wrappers = document.querySelectorAll(".inner-rating");
if(rating_wrappers){
  rating_wrappers.forEach(rating=>{
    const ratingNumber = rating.dataset.rating;
    const ratingInput = rating.querySelector(`input[value="${ratingNumber}"]`);
    ratingInput.checked = true;
  })
}

document.querySelector('form.add-feedback').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);
  const formObject = Object.fromEntries(formData.entries());
  const jsonData = JSON.stringify(formObject);

  fetch("/api/products/detail/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: jsonData
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.code == 200) {
        const date = new Date(data.data.createdAt);
        const formattedDate = date.toLocaleDateString('en-GB');
        const feedbackList = document.querySelector('.box-feedback .main-content');
        const newFeedback = document.createElement('div');
        const avatar = document.getElementById('avatar').value;
        const userName = document.getElementById('userName').value;
        newFeedback.className = 'feedback-item wrapper-flex-gap-15 new-feedback';
        newFeedback.innerHTML = `
          <div class="user-info">
            <div class="inner-image">
              <img src=${avatar} alt="avatar">
            </div>
            <div class="name" title=${userName}>
              ${userName}
            </div>
            <p>${formattedDate}</p>
          </div>
          <div class="content">
            <div class="inner-rating" data-rating=${data.data.rating}>
              <form class="rating">
                <input type="radio" id="star5" name="rating" value="5" disabled>
                <label class="full" for="star5" title="Awesome - 5 stars"></label>

                <input type="radio" id="star4half" name="rating" value="4.5" disabled>
                <label class="half" for="star4half" title="Pretty good - 4.5 stars"></label>

                <input type="radio" id="star4" name="rating" value="4" disabled>
                <label class="full" for="star4" title="Pretty good - 4 stars"></label>

                <input type="radio" id="star3half" name="rating" value="3.5" disabled>
                <label class="half" for="star3half" title="Meh - 3.5 stars"></label>

                <input type="radio" id="star3" name="rating" value="3" disabled>
                <label class="full" for="star3" title="Meh - 3 stars"></label>

                <input type="radio" id="star2half" name="rating" value="2.5" disabled>
                <label class="half" for="star2half" title="Kinda bad - 2.5 stars"></label>

                <input type="radio" id="star2" name="rating" value="2" disabled>
                <label class="full" for="star2" title="Kinda bad - 2 stars"></label>

                <input type="radio" id="star1half" name="rating" value="1.5" disabled>
                <label class="half" for="star1half" title="Meh - 1.5 stars"></label>

                <input type="radio" id="star1" name="rating" value="1" disabled>
                <label class="full" for="star1" title="Sucks big time - 1 star"></label>

                <input type="radio" id="starhalf" name="rating" value="0.5" disabled>
                <label class="half" for="starhalf" title="Sucks big time - 0.5 stars"></label>
              </form>
            </div>
            <p class="comment">${data.data.comment}</p>
          </div>
        `
        feedbackList.prepend(newFeedback);
        const ratingWrappers = document.querySelector(".feedback-item.wrapper-flex-gap-15.new-feedback .inner-rating");
        if(ratingWrappers){
          const ratingNumber = ratingWrappers.dataset.rating;
          const ratingInput = ratingWrappers.querySelector(`input[value="${ratingNumber}"]`);
          ratingInput.checked = true;
        }

        document.querySelector(".add-feedback textarea").value = "";
        document.querySelectorAll('.star-rating input[name="rating"]').forEach(input => input.checked = false);
      }
    })
    .catch(error => {
      console.log(error);
    })
})
