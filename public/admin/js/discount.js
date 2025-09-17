const CUDiscountForm = document.getElementById("CUDiscountForm");
const crudModal = document.getElementById("crud-modal");
const typeEl = document.getElementById("type");
const valueEl = document.getElementById("value");
const quantityEl = document.getElementById("quantity");
const conditionEl = document.getElementById("condition");
const startEl = document.getElementById("startDate");
const endEl = document.getElementById("endDate");
const discountIdEl = document.getElementById("discountId");
const modalTitle = document.getElementById("modalTitle");
const openCreateBtn = document.getElementById("openCreateDiscount");

// Open modal in Edit mode with data
document.querySelectorAll('.button-edit').forEach((btn) => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-id');
    const type = btn.getAttribute('data-type');
    const value = btn.getAttribute('data-value');
    const quantity = btn.getAttribute('data-quantity');
    const condition = btn.getAttribute('data-condition');
    const start = btn.getAttribute('data-start');
    const end = btn.getAttribute('data-end');

    // Fill form
    if (discountIdEl) discountIdEl.value = id || '';
    if (typeEl) typeEl.value = type || '';
    if (valueEl) valueEl.value = value || '';
    if (quantityEl) quantityEl.value = quantity || '';
    if (conditionEl) conditionEl.value = condition || '';
    if (startEl) startEl.value = start ? new Date(start).toISOString().slice(0,16) : '';
    if (endEl) endEl.value = end ? new Date(end).toISOString().slice(0,16) : '';

    if (modalTitle) modalTitle.textContent = 'Edit Discount';

    // Open modal
    if (crudModal) {
      crudModal.classList.remove('hidden');
      crudModal.classList.add('flex');
    }
  });
});

// Open modal in Create mode
if (openCreateBtn) {
  openCreateBtn.addEventListener('click', () => {
    if (discountIdEl) discountIdEl.value = '';
    if (typeEl) typeEl.value = 'coupon';
    if (valueEl) valueEl.value = '';
    if (quantityEl) quantityEl.value = '';
    if (conditionEl) conditionEl.value = '';
    if (startEl) startEl.value = '';
    if (endEl) endEl.value = '';
    if (modalTitle) modalTitle.textContent = 'Create new Discount';
    if (crudModal) {
      crudModal.classList.remove('hidden');
      crudModal.classList.add('flex');
    }
  });
}

// Close modal when click outside (basic fallback if Flowbite not bound)
if (crudModal) {
  crudModal.addEventListener('click', (e) => {
    if (e.target === crudModal) {
      crudModal.classList.add('hidden');
      crudModal.classList.remove('flex');
    }
  });
}

// change status (like products page)
const buttonChangeStatus = document.querySelectorAll('[button-change-status]');
if (buttonChangeStatus.length > 0) {
  const formChangeStatus = document.getElementById('form-change-status');
  if (formChangeStatus) {
    const path = formChangeStatus.getAttribute('data-path');
    buttonChangeStatus.forEach((btn) => {
      btn.addEventListener('click', () => {
        const statusCurrent = btn.getAttribute('data-status');
        const id = btn.getAttribute('data-id');
        const changeStatus = statusCurrent === 'active' ? 'inactive' : 'active';
        const action = `${path}/${changeStatus}/${id}?_method=PATCH`;
        formChangeStatus.action = action;
        formChangeStatus.submit();
      });
    });
  }
}

if(CUDiscountForm){
  CUDiscountForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(CUDiscountForm);
    const formDataObject = Object.fromEntries(formData);

    const isEdit = Boolean(formDataObject.discountId);
    const api = isEdit ? "/admin/discount/edit" : "/admin/discount/create";
    const method = isEdit ? "PATCH" : "POST";

    fetch(api, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formDataObject),
    })
      .then((res) => res.json())
      .then((data) => {
        if ((isEdit && data.message === "Edit discount successfully") || (!isEdit && data.message === "Create discount successfully")) {
          window.location.href = "/admin/discount";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

// --------------- Discount page socket handler ---------------
socket.on("sub-quantity-discount", (data) => {
  const { discountId, quantity } = data;
  console.log("sub-quantity-discount", discountId, quantity);
  const discountItem = document.querySelector(`tr[data-id="${discountId}"]`);
  if (discountItem) {
    const quantityElement = discountItem.querySelector(".discount-quantity");
    console.log("quantityElement", quantityElement);
    if (quantityElement) {
      quantityElement.innerHTML = `${quantity}`;
    }
  }
});

