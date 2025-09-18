const rating_wrappers = document.querySelectorAll(".inner-rating");
if(rating_wrappers){
  rating_wrappers.forEach(rating=>{
    const ratingNumber = rating.dataset.rating;
    const ratingInput = rating.querySelector(`input[value="${ratingNumber}"]`);
    if (ratingNumber > 0 && ratingInput) ratingInput.checked = true;
  })
}

function createClientAlert(type, message, time = 4000) {
  const container = document.createElement('div');
  container.className = 'alert-container';
  const alert = document.createElement('div');
  alert.className = `alert ${type === 'error' ? 'alert-danger' : 'alert-success'}`;
  alert.setAttribute('show-alert', '');
  alert.setAttribute('data-time', String(time));
  alert.innerHTML = `
    <div class="alert-content">
      <div class="alert-icon">${type === 'error' ? '!' : '✓'}</div>
      <div class="alert-message"></div>
      <div class="alert-close" close-alert>×</div>
    </div>
  `;
  alert.querySelector('.alert-message').textContent = message;
  container.appendChild(alert);
  document.body.appendChild(container);

  const closeBtn = alert.querySelector('[close-alert]');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      alert.classList.add('alert-hidden');
      setTimeout(() => container.remove(), 300);
    });
  }
  setTimeout(() => {
    alert.classList.add('alert-hidden');
    setTimeout(() => container.remove(), 300);
  }, time);
}

const feedbackForm = document.querySelector('form.add-feedback');
if (feedbackForm) {
  feedbackForm.addEventListener('submit', function(e) {
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
        if (data.code == 200) {
        const date = new Date(data.data.createdAt);
        const formattedDate = date.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
          const feedbackList = document.querySelector('.box-feedback .main-content');
          const newFeedback = document.createElement('div');
          const avatar = document.getElementById('avatar').value;
          const userName = document.getElementById('userName').value;
          data.data.comment = data.data.comment.replace(/(?:\r\n|\r|\n)/g, '<br>');
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
            <div class="rating-text">${Number(data.data.rating) || 0} sao</div>
            <p class="comment">${data.data.comment}</p>
            </div>
          `
          feedbackList.prepend(newFeedback);
          const ratingWrappers = document.querySelector(".feedback-item.wrapper-flex-gap-15.new-feedback .inner-rating");
          if(ratingWrappers){
            const ratingNumber = ratingWrappers.dataset.rating;
            const ratingInput = ratingWrappers.querySelector(`input[value="${ratingNumber}"]`);
            if (ratingInput) ratingInput.checked = true;
          }

          document.querySelector(".add-feedback textarea").value = "";
          document.querySelectorAll('.star-rating input[name="rating"]').forEach(input => input.checked = false);
        } else {
          createClientAlert('error', data.message || 'Đã xảy ra lỗi khi gửi đánh giá.');
        }
      })
      .catch(error => {
        console.log(error);
        createClientAlert('error', 'Không thể kết nối máy chủ. Vui lòng thử lại.');
      })
  })
}
