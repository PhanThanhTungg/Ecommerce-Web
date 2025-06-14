//Map----------------------------------------
const boxInfo = document.querySelector(".info");
const mapArea = document.querySelector("#map");
const shippingFee = JSON.parse(mapArea.dataset.shippingFee);
const totalPrice = mapArea.dataset.totalPrice;
const freeShip = totalPrice >= shippingFee.freeShippingThreshold ? true : false;
let shippingFeeValue = 0;
let checkMap = false;

let discountCoupon = 0;
let discountShipping = 0;


const displayProvince = document.querySelector('.checkout .info .address-info .display-province');
const displayDistrict = document.querySelector('.checkout .info .address-info .display-district');
const displayWard = document.querySelector('.checkout .info .address-info .display-ward');
const displayAddress = document.querySelector('.checkout .info .address-info .display-address');

let map;
const updateShippingFee = (apiKey, location1, location2) => {
  let url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${location1}&end=${location2}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const deliveryMethod = document.querySelector("input[name='deliveryMethod']:checked").value;
      if (deliveryMethod == "instant") {
        const distance = data.features[0].properties.segments[0].distance / 1000;
        const shipFee = shippingFee.initialFee + Math.floor(distance) * shippingFee.addFeePerKm;
        const shippingValues = document.querySelectorAll(".shipping .value");
        shippingFeeValue = shipFee;
        shippingValues.forEach((shippingValue) => {
          shippingValue.innerText = shipFee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        })

        const totalPriceValues = document.querySelectorAll(".total-price .value");
        totalPriceValues.forEach((totalPriceValue) => {
          totalPriceValue.innerText = (parseInt(totalPrice) + shipFee).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        })
      }
      else if (deliveryMethod == "standard") {
        const selectProvince = boxInfo.querySelector("select.province").value;
        let shipFee;
        if (selectProvince != "Hà Nội") {
          shipFee = shippingFee.interProvincialFee;
        }
        else {
          let selectDistrict = boxInfo.querySelector("select.district").value;
          const checkQuan = /^Quận/.test(selectDistrict);
          if (checkQuan) shipFee = shippingFee.urbanFee;
          else shipFee = shippingFee.suburbanFee;
        }
        const shippingValues = document.querySelectorAll(".shipping .value");
        shippingFeeValue = shipFee;
        shippingValues.forEach((shippingValue) => {
          shippingValue.innerText = shipFee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        })

        const totalPriceValues = document.querySelectorAll(".total-price .value");
        totalPriceValues.forEach((totalPriceValue) => {
          totalPriceValue.innerText = (parseInt(totalPrice) + shipFee).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        })
      }
    })
    .catch(error => console.error("Lỗi:", error));
}

const updateMap = (lat, lng) => {
  mapArea.classList.remove("d-none");
  if (map !== undefined) map.remove();
  map = L.map('map').setView([lat, lng], 100);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  let marker = L.marker([lat, lng], { draggable: true }).addTo(map);

  marker.on('dragend', function (event) {
    var position = marker.getLatLng();
    boxInfo.querySelector("input.locationX").value = position.lat;
    boxInfo.querySelector("input.locationY").value = position.lng;
    let shopLocationId = mapArea.dataset.shoplocationid.split(",");
    shopLocationId = shopLocationId[1].trim() + "," + shopLocationId[0].trim();
    if (!freeShip)
      updateShippingFee(mapArea.dataset.apiKey, `${position.lng},${position.lat}`, shopLocationId)
  });

  map.on('click', function (event) {
    var latlng = event.latlng;
    marker.setLatLng(latlng);
    boxInfo.querySelector("input.locationX").value = latlng.lat;
    boxInfo.querySelector("input.locationY").value = latlng.lng;
    let shopLocationId = mapArea.dataset.shoplocationid.split(",");
    shopLocationId = shopLocationId[1].trim() + "," + shopLocationId[0].trim();
    if (!freeShip)
      updateShippingFee(mapArea.dataset.apiKey, `${latlng.lng},${latlng.lat}`, shopLocationId)
  });

  let shopLocationId = mapArea.dataset.shoplocationid.split(",");
  shopLocationId = shopLocationId[1].trim() + "," + shopLocationId[0].trim();
  let customerLocationid = boxInfo.querySelector("input.locationY").value + "," + boxInfo.querySelector("input.locationX").value;
  if (!freeShip)
    updateShippingFee(mapArea.dataset.apiKey, shopLocationId, customerLocationid);
}

const checkUpdateMap = () => {
  const selectProvince = boxInfo.querySelector("select.province").value;

  let selectDistrict = boxInfo.querySelector("select.district").value;
  const districtSplit = selectDistrict.split(" ");
  selectDistrict = "";
  for (let i = 1; i < districtSplit.length; i++) {
    selectDistrict += districtSplit[i] + " ";
  }
  selectDistrict = selectDistrict.trim();

  let selectWard = boxInfo.querySelector("select.ward").value;
  const wardSplit = selectWard.split(" ");
  selectWard = "";
  for (let i = 1; i < wardSplit.length; i++) {
    selectWard += wardSplit[i] + " ";
  }
  selectWard = selectWard.trim();

  const detail = boxInfo.querySelector("input.detail").value;
  if (selectProvince && selectDistrict && selectWard && detail) {
    const address = `${detail}, ${selectWard}, ${selectDistrict}, ${selectProvince}`;
    let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          let lat = data[0].lat;
          let lng = data[0].lon;
          boxInfo.querySelector("input.locationX").value = lat;
          boxInfo.querySelector("input.locationY").value = lng;
          checkMap = true;
          const addressError = boxInfo.querySelector(".address-error");
          if (addressError) addressError.classList.add("d-none");
          updateMap(lat, lng);
        } else {
          console.log("Không tìm thấy địa chỉ.");
          const addressError = boxInfo.querySelector(".address-error");
          if (addressError) {
            addressError.classList.remove("d-none");
            addressError.innerText = "Không tìm thấy địa chỉ. Vui lòng kiểm tra lại.";

            const shippingValues = document.querySelectorAll(".shipping .value");
            shippingFeeValue = shipFee;
            shippingValues.forEach((shippingValue) => {
              shippingValue.innerText = "-"
            })

            const totalPriceValues = document.querySelectorAll(".total-price .value");
            totalPriceValues.forEach((totalPriceValue) => {
              totalPriceValue.innerText = parseInt(totalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
            })

          }
          const addressSuccess = boxInfo.querySelector(".address-success");
          if (addressSuccess) addressSuccess.classList.add("d-none");
          mapArea.classList.add("d-none");

          checkMap = false;
        }
      })
      .catch(error => console.error("Lỗi:", error));
    console.log(address);
  }

}

// const detail = boxInfo.querySelector("input.detail");
// detail.addEventListener("change", () => {
//   checkUpdateMap();
// })

const buttonAddress = document.querySelector(".btn-address");
if (buttonAddress) {
  buttonAddress.addEventListener("click", () => {
    const selectProvince = boxInfo.querySelector("select.province").value;
    const selectDistrict = boxInfo.querySelector("select.district").value;
    const selectWard = boxInfo.querySelector("select.ward").value;
    const detail = boxInfo.querySelector("input.detail").value;
    if (selectProvince && selectDistrict && selectWard && detail) {
      checkUpdateMap();
    } else {
      const addressError = boxInfo.querySelector(".address-error");
      if (addressError) {
        addressError.classList.remove("d-none");
        addressError.innerText = "Không tìm thấy địa chỉ. Vui lòng kiểm tra lại.";

        const shippingValues = document.querySelectorAll(".shipping .value");
        shippingFeeValue = shipFee;
        shippingValues.forEach((shippingValue) => {
          shippingValue.innerText = "-"
        })

        const totalPriceValues = document.querySelectorAll(".total-price .value");
        totalPriceValues.forEach((totalPriceValue) => {
          totalPriceValue.innerText = parseInt(totalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        })
      }
      const addressSuccess = boxInfo.querySelector(".address-success");
      if (addressSuccess) addressSuccess.classList.add("d-none");
    }
  })
}


//End - Map-------------------------------------




let provinces = [];
let districts = [];
let wards = [];

// api hành chính việt nam
async function getProvinces() {
  try {
    const res = await fetch(`https://open.oapi.vn/location/provinces?size=100`);
    const data = await res.json();
    provinces = data.data;
    provinces.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    $('.checkout .info .province').select2({
      placeholder: "Province",
      width: '100%',
      data: provinces.map(item => ({
        id: item.name,
        text: item.name,
        _resultId: item.id
      })),
    })
  } catch (error) {
    console.error(error);
  }
}

async function getDistricts(provinceId) {
  const res = await fetch(`https://open.oapi.vn/location/districts/${provinceId}?size=100`);
  const data = await res.json();
  districts = data.data;
  districts.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
}

async function getWards(districtId) {
  const res = await fetch(`https://open.oapi.vn/location/wards/${districtId}?size=100`);
  const data = await res.json();
  wards = data.data;
  wards.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
}

async function action() {
  await getProvinces();
  $('.checkout .info .district').select2({
    placeholder: "District",
    width: '100%',
  })
  $('.checkout .info .ward').select2({
    placeholder: "Commune",
    width: '100%',
  })

  $('.checkout .info .province').on('select2:select', async function (e) {
    const selectElement = $('.checkout .info .district');
    selectElement.select2('destroy');
    selectElement.empty();
    await getDistricts(e.params.data._resultId);
    $('.checkout .info .district').select2({
      placeholder: "District",
      width: '100%',
      data: districts.map(item => ({
        id: item.name,
        text: item.name,
        _resultId: item.id
      })),
      language: {
        noResults: function () {
          return 'Vui lòng chọn tỉnh';
        },
        error: function () {
          return 'Vui lòng chọn một tỉnh.';
        }
      }
    })
    selectElement.val('').trigger('change');

    const addressError = boxInfo.querySelector(".address-error");
    if (addressError) addressError.classList.add("d-none");
    const addressSuccess = boxInfo.querySelector(".address-success");
    if (addressSuccess) addressSuccess.classList.remove("d-none");

    displayProvince.innerText = e.params.data.text;
    displayDistrict.innerText = "";
    displayWard.innerText = "";
    document.querySelector('.province + span .select2-selection--single').classList.add('dirty');

    const selectWard = $('.checkout .info .ward');
    selectWard.select2('destroy');
    selectWard.empty();
    $('.checkout .info .ward').select2({
      placeholder: 'Commune',
      width: '100%'
    })
  })

  $('.checkout .info .district').on('select2:select', async function (e) {
    const selectElement = $('.checkout .info .ward');
    selectElement.select2('destroy');
    selectElement.empty();
    await getWards(e.params.data._resultId);
    $('.checkout .info .ward').select2({
      placeholder: "Commune",
      width: '100%',
      data: wards.map(item => ({
        id: item.name,
        text: item.name,
        _resultId: item.id
      })),
    })
    selectElement.val('').trigger('change');

    const addressError = boxInfo.querySelector(".address-error");
    if (addressError) addressError.classList.add("d-none");
    const addressSuccess = boxInfo.querySelector(".address-success");
    if (addressSuccess) addressSuccess.classList.remove("d-none");

    displayDistrict.innerText = e.params.data.text + ", ";
    displayWard.innerText = "";
    document.querySelector('.district + span .select2-selection--single').classList.add('dirty');
  })

  $('.checkout .info .ward').on('select2:select', async function (e) {
    const addressError = boxInfo.querySelector(".address-error");
    if (addressError) addressError.classList.add("d-none");
    const addressSuccess = boxInfo.querySelector(".address-success");
    if (addressSuccess) addressSuccess.classList.remove("d-none");
    displayWard.innerText = e.params.data.text + ", ";
    document.querySelector('.ward + span .select2-selection--single').classList.add('dirty');
  })

  const inputDetailAddress = document.querySelector('input[name="detail"]');
  inputDetailAddress.addEventListener('input', function () {
    if (this.value) {
      const addressError = boxInfo.querySelector(".address-error");
      if (addressError) addressError.classList.add("d-none");
      const addressSuccess = boxInfo.querySelector(".address-success");
      if (addressSuccess) addressSuccess.classList.remove("d-none");
      displayAddress.innerText = this.value + ", ";
    } else {
      displayAddress.innerText = "";
    }
  })
}

action()

// payment

function check(value) {
  const input = document.getElementById(value);
  input.checked = true;
  document.querySelectorAll(".payment-method .form-check").forEach((div) => {
    div.classList.remove("selected");
  });
  input.parentElement.classList.add("selected");
}


//collapse icon
document.addEventListener('DOMContentLoaded', function () {
  const totalPriceCollapseIcon = document.getElementById('totalPriceCollapse');
  const collapseOrderProduct = document.getElementById('collapseOrderProduct');

  $(collapseOrderProduct).on("show.bs.collapse", function () {
    totalPriceCollapseIcon.classList.remove("fi-rr-angle-down");
    totalPriceCollapseIcon.classList.add("fi-rr-angle-up");
  });

  $(collapseOrderProduct).on("hide.bs.collapse", function () {
    totalPriceCollapseIcon.classList.remove("fi-rr-angle-up");
    totalPriceCollapseIcon.classList.add("fi-rr-angle-down");
  });
})

const qrSection = document.querySelector(".section-qr");
if (qrSection) {

}

const successPage = document.querySelector(".success");
if (successPage) {
  const orderId = successPage.dataset.orderId;
  const paymentMethod = successPage.dataset.paymentMethod;
  if (paymentMethod = "qr") {
    const fetchApi = () => {
      fetch(`/api/checkout/delivery-status/qr/${orderId}`).then(res => res.json())
        .then(data => {
          console.log(data);
          // if(data.paymentStatus == "ok")
        })
    }
    setInterval(fetchApi, 15000);
  }
}

// hide qr code


// handle form submit
const formCheckout = document.querySelector(".checkout form.form-checkout");
if (formCheckout) {
  formCheckout.addEventListener("submit", (e) => {
    e.preventDefault();
    if (checkMap == false) {
      const addressError = boxInfo.querySelector(".address-error");
      if (addressError) addressError.classList.remove("d-none");
      const addressSuccess = boxInfo.querySelector(".address-success");
      if (addressSuccess) addressSuccess.classList.add("d-none");
      addressError.innerText = "Vui lòng kiểm tra lại địa chỉ.";
      addressError.classList.add("text-danger");
      window.scrollTo({ top: addressError.offsetTop - 50, behavior: "smooth" });
      return;
    }

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "shippingFee";
    input.value = shippingFeeValue;
    formCheckout.appendChild(input);

    const textArea = document.createElement("textarea");
    textArea.name = "note";
    textArea.style.display = "none";
    textArea.value = document.querySelector(".input-note textarea").value;

    const inputDiscountCoupon = document.createElement("input");
    inputDiscountCoupon.type = "hidden";
    inputDiscountCoupon.name = "discountCoupon";
    inputDiscountCoupon.value = discountCoupon;

    const inputDiscountShipping = document.createElement("input");
    inputDiscountShipping.type = "hidden";
    inputDiscountShipping.name = "discountShipping";
    inputDiscountShipping.value = discountShipping;

    formCheckout.appendChild(inputDiscountCoupon);
    formCheckout.appendChild(inputDiscountShipping);
    formCheckout.appendChild(textArea);

    e.target.submit();
    
  })
}
// end - handle form submit

// handle input note
const inputNotes = document.querySelectorAll(".input-note textarea");
if (inputNotes) {
  inputNotes.forEach((inputNote) => {
    inputNote.addEventListener("input", (e) => {
      const value = e.target.value;
      inputNotes.forEach((note) => {
        if (note !== e.target) {
          note.value = value;
        }
      });
    });
  });
}
//end - handle input note

//handle delivery method change 
const deliveryMethodInput = document.querySelectorAll(".delivery-method input[type='radio']");
if (deliveryMethodInput) {
  deliveryMethodInput.forEach(input => {
    input.addEventListener("change", e => {
      checkUpdateMap();
    })
  })
}

//remove form enter click
const form = document.querySelector(".form-checkout");
if (form) {
  form.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });
}


// handle user choose discount
const radioCoupons = document.querySelectorAll("input[name=coupon]");
const radioShipping = document.querySelectorAll("input[name=shipping]");


const updateTotalPrice = ()=>{
  const totalPriceValues = document.querySelectorAll(".total-price .value");
  totalPriceValues.forEach((totalPriceValue) => {
    totalPriceValue.innerText = Math.floor(parseInt(totalPrice)*(100-discountCoupon)/100 + shippingFeeValue*(100-discountShipping)/100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  })
}


if(radioCoupons){
  radioCoupons.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const discountValue = e.target.getAttribute("data-value");
      const input = document.querySelector("input[name=discount-coupon-number]");
      if(input){
        input.value = discountValue;
        discountCoupon = +discountValue.trim();
        updateTotalPrice()
      }
    })
  })
}
if(radioShipping){
  radioShipping.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const shippingValue = e.target.getAttribute("data-value");
      const input = document.querySelector("input[name=discount-shipping-number]");
      if(input){
        input.value = shippingValue;
        discountShipping = +shippingValue.trim();
        updateTotalPrice()
      }
    })
  })
}