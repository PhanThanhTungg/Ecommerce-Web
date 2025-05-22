const CUDiscountForm = document.getElementById("CUDiscountForm");

CUDiscountForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const formData = new FormData(CUDiscountForm);
  const formDataObject = Object.fromEntries(formData);
  const api = "/admin/discount/create";
  fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataObject),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message = "Create discount successfully") {
        window.location.href = "/admin/discount";
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

