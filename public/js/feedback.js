// FE pagination for product feedback
(function () {
  const feedbackListEl = document.querySelector('.feedback-list');
  if (!feedbackListEl) return;

  // data
  let feedbackData = [];
  try {
    const raw = feedbackListEl.getAttribute('data-feedback') || '[]';
    feedbackData = JSON.parse(raw);
  } catch (e) {
    feedbackData = [];
  }

  const pageSize = 5; // items per page
  let currentPage = 1;

  const paginationNav = document.querySelector('.pagination-product ul');
  const prevBtn = paginationNav?.querySelector('.prev');
  const nextBtn = paginationNav?.querySelector('.next');

  function renderPage(page) {
    currentPage = page;

    // slice data
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = feedbackData.slice(start, end);

    // render feedback items
    feedbackListEl.innerHTML = pageItems.map((fb) => {
      const avatar = (fb?.userDetail?.thumbnail || '').replace('upload/', 'upload/c_limit,w_80/f_auto/');
      const name = fb?.userDetail?.fullName || 'User';
      const createdAt = fb?.createdAt || '';
      const rating = fb?.rating || 0;
      const comment = (fb?.comment || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `
        <div class="feedback-item wrapper-flex-gap-15">
          <div class="user-info">
            <div class="inner-image">
              <img src="${avatar}">
            </div>
            <div class="name" title="${name}">${name}</div>
            <span>${window.formatDate ? window.formatDate(createdAt) : ''}</span>
          </div>
          <div class="content">
            <div class="inner-rating" data-rating="${rating}"></div>
            <p class="comment" style="white-space: pre-line;">${comment}</p>
          </div>
        </div>
      `;
    }).join('');

    // re-render rating stars if helper exists
    if (window.renderRating) {
      document.querySelectorAll('.feedback-list .inner-rating').forEach((el) => {
        const value = Number(el.getAttribute('data-rating') || 0);
        window.renderRating(el, value);
      });
    }

    // render pagination numbers
    renderPaginationNumbers();

    // update prev/next disabled
    const totalPages = Math.max(1, Math.ceil(feedbackData.length / pageSize));
    if (prevBtn) prevBtn.toggleAttribute('disabled', currentPage <= 1);
    if (nextBtn) nextBtn.toggleAttribute('disabled', currentPage >= totalPages);
  }

  function renderPaginationNumbers() {
    if (!paginationNav) return;
    // cleanup numbers except prev/next
    paginationNav.querySelectorAll('li.numb, li.dots').forEach((n) => n.remove());

    const totalPages = Math.max(1, Math.ceil(feedbackData.length / pageSize));

    function createNum(page) {
      const li = document.createElement('li');
      li.className = 'numb' + (page === currentPage ? ' active' : '');
      li.textContent = String(page);
      li.addEventListener('click', () => renderPage(page));
      return li;
    }

    function createDots() {
      const li = document.createElement('li');
      li.className = 'dots';
      li.textContent = '...';
      return li;
    }

    const nodes = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) nodes.push(createNum(i));
    } else {
      nodes.push(createNum(1));
      const left = Math.max(2, currentPage - 1);
      const right = Math.min(totalPages - 1, currentPage + 1);
      if (left > 2) nodes.push(createDots());
      for (let i = left; i <= right; i++) nodes.push(createNum(i));
      if (right < totalPages - 1) nodes.push(createDots());
      nodes.push(createNum(totalPages));
    }

    // insert before next button
    const next = paginationNav.querySelector('li.next');
    nodes.forEach((n) => paginationNav.insertBefore(n, next));
  }

  // events
  prevBtn?.addEventListener('click', () => {
    if (currentPage > 1) renderPage(currentPage - 1);
  });
  nextBtn?.addEventListener('click', () => {
    const totalPages = Math.max(1, Math.ceil(feedbackData.length / pageSize));
    if (currentPage < totalPages) renderPage(currentPage + 1);
  });

  // initial render
  renderPage(1);
})();
