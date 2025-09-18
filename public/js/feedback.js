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

  // build custom star icons for list (independent from existing rating UI)
  function buildStars(ratingValue) {
    const value = Number(ratingValue) || 0;
    const full = Math.floor(value);
    const hasHalf = value - full >= 0.5;
    const empty = 5 - full - (hasHalf ? 1 : 0);
    const stars = [];
    for (let i = 0; i < full; i++) stars.push('<i class="fa-solid fa-star"></i>');
    if (hasHalf) stars.push('<i class="fa-solid fa-star-half-stroke"></i>');
    for (let i = 0; i < empty; i++) stars.push('<i class="fa-regular fa-star"></i>');
    return `<div class="fb-stars" style="color:#FFD700;display:inline-flex;gap:2px;font-size:16px;line-height:1">${stars.join('')}</div>`;
  }

  function renderPage(page) {
    currentPage = page;

    // slice data
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    // filter by selected star
    const selectEl = document.getElementById('feedback-star-filter');
    const selected = selectEl ? selectEl.value : 'all';
    const list = Array.isArray(feedbackData) ? (
      selected === 'all' ? feedbackData : feedbackData.filter((fb) => Number(fb?.rating || 0) === Number(selected))
    ) : [];
    const pageItems = list.slice(start, end);

    // render feedback items (custom star icons)
    feedbackListEl.innerHTML = pageItems.map((fb) => {
      const avatar = (fb?.userDetail?.thumbnail || '').replace('upload/', 'upload/c_limit,w_80/f_auto/');
      const name = fb?.userDetail?.fullName || 'User';
      const createdAt = fb?.createdAt || '';
      const rating = fb?.rating || 0;
      const comment = (fb?.comment || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      let createdAtText = '';
      try {
        const d = new Date(createdAt);
        createdAtText = d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
      } catch (e) { createdAtText = ''; }
      const stars = buildStars(rating);
      return `
        <div class="feedback-item wrapper-flex-gap-15" data-user-id="${fb?.userId || ''}">
          <div class="user-info">
            <div class="inner-image">
              <img src="${avatar}">
            </div>
            <div class="name" title="${name}">${name}</div>
            <span>${createdAtText}</span>
          </div>
          <div class="content">
            ${stars}
            <p class="comment" style="white-space: pre-line;">${comment}</p>
          </div>
        </div>
      `;
    }).join('');

    // insert separator under current user's feedback if it's on top
    const currentUserId = document.getElementById('currentUserId')?.value;
    if (currentUserId) {
      const firstItem = feedbackListEl.querySelector('.feedback-item');
      if (firstItem && firstItem.getAttribute('data-user-id') === currentUserId) {
        const sep = document.createElement('div');
        sep.className = 'my-feedback-separator';
        firstItem.after(sep);
      }
    }


    // render pagination numbers
    renderPaginationNumbers();

    // update prev/next disabled
    const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
    if (prevBtn) prevBtn.toggleAttribute('disabled', currentPage <= 1);
    if (nextBtn) nextBtn.toggleAttribute('disabled', currentPage >= totalPages);
  }

  function renderPaginationNumbers() {
    if (!paginationNav) return;
    // cleanup numbers except prev/next
    paginationNav.querySelectorAll('li.numb, li.dots').forEach((n) => n.remove());

    const selectEl = document.getElementById('feedback-star-filter');
    const selected = selectEl ? selectEl.value : 'all';
    const list = Array.isArray(feedbackData) ? (
      selected === 'all' ? feedbackData : feedbackData.filter((fb) => Number(fb?.rating || 0) === Number(selected))
    ) : [];
    const totalPages = Math.max(1, Math.ceil(list.length / pageSize));

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
    const selectEl = document.getElementById('feedback-star-filter');
    const selected = selectEl ? selectEl.value : 'all';
    const list = Array.isArray(feedbackData) ? (
      selected === 'all' ? feedbackData : feedbackData.filter((fb) => Number(fb?.rating || 0) === Number(selected))
    ) : [];
    const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
    if (currentPage < totalPages) renderPage(currentPage + 1);
  });

  // handle select change
  document.getElementById('feedback-star-filter')?.addEventListener('change', () => {
    currentPage = 1;
    renderPage(1);
  });

  // initial render
  renderPage(1);
})();
