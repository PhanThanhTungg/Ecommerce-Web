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

  $('.checkout .info .province').on('select2:select', async function(e) {
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
        noResults: function() {
            return 'Vui lòng chọn tỉnh';
        },
        error: function() {
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
    $('.checkout .info .ward').select2({
      placeholder: 'Phường/Xã',
      width: '100%'
    })
  })
  
  $('.checkout .info .district').on('select2:select', async function(e) {
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
  })

  $('.checkout .info .ward').on('select2:select', async function(e) {
    displayWard.innerText = e.params.data.text + ", ";
    document.querySelector('.ward + span .select2-selection--single').classList.add('dirty');
  })

  const inputDetailAddress = document.querySelector('input[name="detail"]');
  inputDetailAddress.addEventListener('input', function() {
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
document.addEventListener('DOMContentLoaded', function() {
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

// handle checkout
// const formCheckout = document.querySelector(".form-checkout");
// if(formCheckout){
//   formCheckout.addEventListener("submit", (e)=>{
//     e.preventDefault();
//     e.target.action += "qrcode";
//     const orderProducts = JSON.parse(e.target.orderProducts.value);
//     const totalPrice = +e.target.orderProducts.dataset.total;
    
//     // e.target.submit();
//   })
// }

