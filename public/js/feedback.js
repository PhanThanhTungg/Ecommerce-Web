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
  const starFilterGroup = document.querySelector('.star-filter-buttons');

  function getSelectedStar() {
    const activeBtn = starFilterGroup?.querySelector('.btn-star.active');
    const value = activeBtn?.getAttribute('data-star') || 'all';
    return value;
  }

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
    // filter by selected star (buttons)
    const selected = getSelectedStar();
    const list = Array.isArray(feedbackData) ? (
      selected === 'all' ? feedbackData : feedbackData.filter((fb) => Number(fb?.rating || 0) === Number(selected))
    ) : [];
    const pageItems = list.slice(start, end);

    // render feedback items (custom star icons) + like/reply UI
    feedbackListEl.innerHTML = pageItems.map((fb) => {
      const avatar = (fb?.userDetail?.thumbnail || '').replace('upload/', 'upload/c_limit,w_80/f_auto/');
      const name = fb?.userDetail?.fullName || 'User';
      const createdAt = fb?.createdAt || '';
      const rating = fb?.rating || 0;
      const comment = (fb?.comment || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      let createdAtText = '';
      try {
        const d = new Date(createdAt);
        createdAtText = d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
      } catch (e) { createdAtText = ''; }
      const stars = buildStars(rating);
      const replies = Array.isArray(fb?.replies) ? fb.replies : [];
      const repliesHtml = replies.map((rp) => {
        const rName = rp?.userDetail?.fullName || '';
        const rAvatar = (rp?.userDetail?.thumbnail || '').replace('upload/', 'upload/c_limit,w_60/f_auto/');
        let rTime = '';
        try { rTime = new Date(rp?.createdAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }); } catch {}
        const rComment = (rp?.comment || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `
          <div class="reply-item wrapper-flex-gap-10">
            <div class="inner-image"><img src="${rAvatar}"></div>
            <div class="reply-body">
              <div class="reply-meta"><span class="name">${rName}</span><span class="time">${rTime}</span></div>
              <div class="reply-comment" style="white-space: pre-line;">${rComment}</div>
            </div>
          </div>
        `;
      }).join('');

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
            <div class="actions">
              <button class="btn-like" data-id="${fb?._id}"><i class="fa-regular fa-thumbs-up"></i> Like (<span class="likes">${fb?.likesCount || 0}</span>)</button>
              <button class="btn-reply-toggle" data-id="${fb?._id}"><i class="fa-regular fa-comment"></i> Reply</button>
            </div>
            <div class="replies">
              ${repliesHtml}
            </div>
            <form class="reply-form d-none" data-id="${fb?._id}">
              <textarea rows="2" placeholder="Type your reply..."></textarea>
              <div class="reply-actions">
                <button type="submit">Send</button>
                <button type="button" class="btn-cancel">Cancel</button>
              </div>
            </form>
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
    // bind like & reply events
    bindActions();
  }

  function renderPaginationNumbers() {
    if (!paginationNav) return;
    // cleanup numbers except prev/next
    paginationNav.querySelectorAll('li.numb, li.dots').forEach((n) => n.remove());

    const selected = getSelectedStar();
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
    const selected = getSelectedStar();
    const list = Array.isArray(feedbackData) ? (
      selected === 'all' ? feedbackData : feedbackData.filter((fb) => Number(fb?.rating || 0) === Number(selected))
    ) : [];
    const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
    if (currentPage < totalPages) renderPage(currentPage + 1);
  });

  // handle star filter buttons
  if (starFilterGroup) {
    starFilterGroup.querySelectorAll('.btn-star').forEach((btn) => {
      btn.addEventListener('click', () => {
        const currentActive = starFilterGroup.querySelector('.btn-star.active');
        if (currentActive === btn) return; // no change
        currentActive?.classList.remove('active');
        btn.classList.add('active');
        currentPage = 1;
        renderPage(1);
      });
    });
  }

  // initial render
  renderPage(1);

  function bindActions() {
    const userId = document.getElementById('currentUserId')?.value;
    // like
    document.querySelectorAll('.feedback-list .btn-like').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!userId) return window.createClientAlert && window.createClientAlert('error', 'Please sign in.');
        const id = btn.getAttribute('data-id');
        fetch(`/api/products/detail/feedback/${id}/like`, { method: 'POST' })
          .then((r) => r.json())
          .then((d) => {
            if (d.code === 200) {
              const likesEl = btn.querySelector('.likes');
              if (likesEl) likesEl.textContent = String(d.data.likesCount || 0);
            } else {
              window.createClientAlert && window.createClientAlert('error', d.message || 'Unable to like this review.');
            }
          })
          .catch(() => window.createClientAlert && window.createClientAlert('error', 'Network error.'))
      })
    });

    // toggle reply form
    document.querySelectorAll('.feedback-list .btn-reply-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const form = document.querySelector(`.feedback-list form.reply-form[data-id="${id}"]`);
        if (form) form.classList.toggle('d-none');
      })
    });

    // submit reply
    document.querySelectorAll('.feedback-list form.reply-form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!userId) return window.createClientAlert && window.createClientAlert('error', 'Please sign in.');
        const id = form.getAttribute('data-id');
        const ta = form.querySelector('textarea');
        const comment = (ta?.value || '').trim();
        if (!comment) return;
        fetch(`/api/products/detail/feedback/${id}/reply`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ comment })
        }).then(r => r.json()).then(d => {
          if (d.code === 200) {
            // append reply
            const replies = form.previousElementSibling; // .replies
            const avatar = document.getElementById('avatar')?.value || '';
            const userName = document.getElementById('userName')?.value || '';
            const time = new Date(d.data.createdAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
            const div = document.createElement('div');
            div.className = 'reply-item wrapper-flex-gap-10';
            div.innerHTML = `
              <div class="inner-image"><img src="${avatar}"></div>
              <div class="reply-body">
                <div class="reply-meta"><span class="name">${userName}</span><span class="time">${time}</span></div>
                <div class="reply-comment" style="white-space: pre-line;">${comment.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
              </div>`;
            replies?.appendChild(div);
            ta.value = '';
            form.classList.add('d-none');
          } else {
            window.createClientAlert && window.createClientAlert('error', d.message || 'Không thể trả lời.');
          }
        }).catch(() => window.createClientAlert && window.createClientAlert('error', 'Lỗi mạng.'))
      });
      // cancel
      const cancelBtn = form.querySelector('.btn-cancel');
      cancelBtn?.addEventListener('click', () => form.classList.add('d-none'));
    });
  }
})();
