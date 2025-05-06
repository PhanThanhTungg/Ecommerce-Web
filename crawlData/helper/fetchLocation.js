export const fetchProvince = async()=>{
  const res = await (await fetch("https://open.oapi.vn/location/provinces?size=63")).json();

  return res.data.map(item=>{
    return {
      name: item.name,
      id: item.id
    }
  })
}

export const fetchDistrict = async(provinceId)=>{
  const res = await (await fetch(`https://open.oapi.vn/location/districts/${provinceId}?size=100`)).json();
  return res.data.map(item=>{
    return {
      name: item.name,
      id: item.id
    }
  })
}

export const fetchWard = async(districtId)=>{
  const res = await (await fetch(`https://open.oapi.vn/location/wards/${districtId}?size=100`)).json();
  return res.data.map(item=>{
    return {
      name: item.name
    }
  })
}
