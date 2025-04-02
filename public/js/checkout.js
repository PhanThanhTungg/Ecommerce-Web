//Map----------------------------------------
const boxInfo = document.querySelector(".info");
const mapArea = document.querySelector("#map");
let map;
const updateShippingFee = (apiKey, location1, location2) => {
  let url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${location1}&end=${location2}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const distance = data.features[0].properties.segments[0].distance
      console.log(distance/1000);
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
  });

  map.on('click', function (event) {
    var latlng = event.latlng;
    marker.setLatLng(latlng);
    boxInfo.querySelector("input.locationX").value = latlng.lat;
    boxInfo.querySelector("input.locationY").value = latlng.lng;
  });

  let shopLocationId = mapArea.dataset.shoplocationid.split(",");
  shopLocationId = shopLocationId[1].trim() + "," + shopLocationId[0].trim();
  let customerLocationid = boxInfo.querySelector("input.locationY").value + "," + boxInfo.querySelector("input.locationX").value;
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
          updateMap(lat, lng);
        } else {
          console.log("Không tìm thấy địa chỉ.");
        }
      })
      .catch(error => console.error("Lỗi:", error));
    console.log(address);
  }

}

const detail = boxInfo.querySelector("input.detail");
detail.addEventListener("change", () => {
  checkUpdateMap();
})


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
      placeholder: "Tỉnh/Thành",
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
  console.log(districtId);
  const res = await fetch(`https://open.oapi.vn/location/wards/${districtId}?size=100`);
  const data = await res.json();
  wards = data.data;
  wards.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
}

async function action() {
  await getProvinces();
  $('.checkout .info .district').select2({
    placeholder: "Quận/Huyện",
    width: '100%',
  })
  $('.checkout .info .ward').select2({
    placeholder: "Phường/Xã",
    width: '100%',
  })

  const displayProvince = document.querySelector('.checkout .info .address-info .display-province');
  const displayDistrict = document.querySelector('.checkout .info .address-info .display-district');
  const displayWard = document.querySelector('.checkout .info .address-info .display-ward');
  const displayAddress = document.querySelector('.checkout .info .address-info .display-address');

  $('.checkout .info .province').on('select2:select', async function (e) {
    const selectElement = $('.checkout .info .district');
    selectElement.select2('destroy');
    selectElement.empty();
    await getDistricts(e.params.data._resultId);
    $('.checkout .info .district').select2({
      placeholder: "Quận/Huyện",
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

    displayProvince.innerText = e.params.data.text;
    displayDistrict.innerText = "";
    displayWard.innerText = "";
    document.querySelector('.province + span .select2-selection--single').classList.add('dirty');

    const selectWard = $('.checkout .info .ward');
    selectWard.select2('destroy');
    selectWard.empty();
    checkUpdateMap();
    $('.checkout .info .ward').select2({
      placeholder: 'Phường/Xã',
      width: '100%'
    })
  })

  $('.checkout .info .district').on('select2:select', async function (e) {
    const selectElement = $('.checkout .info .ward');
    selectElement.select2('destroy');
    selectElement.empty();
    await getWards(e.params.data._resultId);
    $('.checkout .info .ward').select2({
      placeholder: "Phường/Xã",
      width: '100%',
      data: wards.map(item => ({
        id: item.name,
        text: item.name,
        _resultId: item.id
      })),
    })
    selectElement.val('').trigger('change');

    displayDistrict.innerText = e.params.data.text + ", ";
    displayWard.innerText = "";
    document.querySelector('.district + span .select2-selection--single').classList.add('dirty');
    checkUpdateMap()
  })

  $('.checkout .info .ward').on('select2:select', async function (e) {
    displayWard.innerText = e.params.data.text + ", ";
    document.querySelector('.ward + span .select2-selection--single').classList.add('dirty');
    checkUpdateMap();
  })

  const inputDetailAddress = document.querySelector('input[name="detail"]');
  inputDetailAddress.addEventListener('input', function () {
    if (this.value) {
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

