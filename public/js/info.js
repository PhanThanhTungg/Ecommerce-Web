const itemSelected = document.querySelector("select[name ='sex']").getAttribute("optionSelected")
if(itemSelected){
  const select = document.querySelector(`option[value='${itemSelected}']`)
  select.selected = true
}

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
    $('.main-user-info .province').select2({
      placeholder: "Province",
      width: '100%',
      data: provinces.map(item => ({
        id: item.name,
        text: item.name,
        _resultId: item.id
      })),
    })
    $('.main-user-info .province').val(null).trigger('change');
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
  $('.main-user-info .district').select2({
    placeholder: "District",
    width: '100%',
  })
  $('.main-user-info .ward').select2({
    placeholder: "Commune",
    width: '100%',
  })

  const displayProvince = document.querySelector('.address-info .display-province');
  const displayDistrict = document.querySelector('.address-info .display-district');
  const displayWard = document.querySelector('.address-info .display-ward');
  const displayAddress = document.querySelector('.address-info .display-address');
  displayProvince.innerHTML = '';
  displayDistrict.innerHTML = '';
  displayWard.innerHTML = '';
  displayAddress.innerHTML = '';

  $('.main-user-info .province').on('select2:select', async function(e) {
    const selectElement = $('.main-user-info .district');    
    selectElement.select2('destroy');
    selectElement.empty();
    await getDistricts(e.params.data._resultId);
    $('.main-user-info .district').select2({
      placeholder: "District",
      width: '100%',
      data: districts.map(item => ({
        id: item.name,
        text: item.name,
        _resultId: item.id
      }))
    })
    selectElement.val('').trigger('change');

    displayProvince.innerText = e.params.data.text;
    displayDistrict.innerText = "";
    displayWard.innerText = "";
    document.querySelector('.province + span .select2-selection--single').classList.add('dirty');

    const selectWard = $('.main-user-info .ward');    
    selectWard.select2('destroy');
    selectWard.empty();
    $('.main-user-info .ward').select2({
      placeholder: 'Commune',
      width: '100%'
    })
  })
  
  $('.main-user-info .district').on('select2:select', async function(e) {
    const selectElement = $('.main-user-info .ward');    
    selectElement.select2('destroy');
    selectElement.empty();
    await getWards(e.params.data._resultId);
    $('.main-user-info .ward').select2({
      placeholder: "Commune",
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

  $('.main-user-info .ward').on('select2:select', async function(e) {
    displayWard.innerText = e.params.data.text + ", ";
    document.querySelector('.ward + span .select2-selection--single').classList.add('dirty');
  })

  const inputDetailAddress = document.querySelector('input[name="detail"]');
  inputDetailAddress.value = '';
  inputDetailAddress.addEventListener('input', function() {
    if (this.value) {
      displayAddress.innerText = this.value + ", ";
    } else {
      displayAddress.innerText = "";
    }
  })
  
}
document.addEventListener('DOMContentLoaded', function() {
  action();
  $('#addressModal').on('hidden.bs.modal', function () {
    $('.main-user-info .province').select2('destroy');
    $('.main-user-info .district').select2('destroy');
    $('.main-user-info .ward').select2('destroy');
    $('.main-user-info .province').empty();
    $('.main-user-info .district').empty();
    $('.main-user-info .ward').empty();  
    action()
  });
});


//add address form
document.getElementById('add-address-form').addEventListener("submit", async function(event) {
  event.preventDefault();

  $('#addressModal').modal('hide');

  const formData = new FormData(this);
  const formObject = Object.fromEntries(formData.entries());
  const jsonData = JSON.stringify(formObject);

  try {
    const res = await fetch("/api/user/addInformation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: jsonData
    });
    const result = await res.json();
    console.log(result);
    location.reload();
  } catch (error) {
    console.log(error);    
  }
})


