// Tạo namespace Helper
const Helper = {};

//Viết hoa chữ cái đầu của từng từ
Helper.capitalize = function(string) {
  return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

/**
 * Định dạng các số lớn thành dạng dễ đọc (K, M, B)
 * @param {number} number - Số cần định dạng
 * @returns {string} Số đã được định dạng
 */
Helper.formatLargeNumber = function(number) {
  if (number >= 1e9) {
    return (number / 1e9).toFixed(2) + 'B';
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(2) + 'M';
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(2) + 'K';
  }
  return number.toString();
};

/**
 * Tạo cấu hình toolbar cho ApexCharts
 * @returns {object} Cấu hình toolbar
 */
Helper.getChartToolbarOptions = function() {
  return {
    show: true,
    offsetX: 0,
    offsetY: 0,
    tools: {
      download: true,
      selection: true,
      zoom: true,
      zoomin: true,
      zoomout: true,
      pan: true,
      reset: true,
      customIcons: []
    }
  };
}

Helper.calculateChartHeight = function(dataLength, chartType = 'bar', horizontal = false) {
  const minHeight = 350;
  if (chartType === 'bar' && horizontal) {
    const calculatedHeight = Math.max(dataLength * 20, minHeight);
    
    return calculatedHeight;
  }
  
  // Với các loại biểu đồ khác, có thể áp dụng các quy tắc khác
  // Ví dụ: biểu đồ đường có thể cần ít chiều cao hơn
  if (chartType === 'line') {
    return minHeight;
  }
  // Trường hợp mặc định
  return minHeight;
};

Helper.getChartZoomOptions = function() {
  return {
    enabled: true,
    type: 'x',  
    autoScaleYaxis: false,  
    allowMouseWheelZoom: true,  
    zoomedArea: {
      fill: {
        color: '#90CAF9',
        opacity: 0.4
      },
      stroke: {
        color: '#0D47A1',
        opacity: 0.4,
        width: 1
      }
    }
  }
}

Helper.formatDate = function(dateStr) {
  const date = new Date(dateStr);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

Helper.translate = function(key) {
  const translation = {
    "day": "ngày",
    "month": "tháng",
    "year": "năm",
    "province": "tỉnh/thành",
    "district": "quận/huyện",
    "commune": "phường/xã",
    "category": "danh mục sản phẩm",
    "product": "sản phẩm",
    "customer": "khách hàng",
    "gender": "giới tính",
    "type": "mạng xã hội",
    "delivery": "phương thức giao hàng",
    "payment": "phương thức thanh toán",
  }
  return translation[key] || key;
}

// Thêm Helper vào window để các script khác có thể sử dụng
window.Helper = Helper;