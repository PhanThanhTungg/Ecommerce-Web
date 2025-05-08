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
    tools: {
      download: true,
      selection: true,
      zoom: true,
      zoomin: true,
      zoomout: true,
      pan: true,
      reset: true
    }
  };
};

/**
 * Tính toán chiều cao phù hợp cho biểu đồ dựa trên số lượng dữ liệu
 * @param {number} dataLength - Số lượng mục dữ liệu
 * @param {string} chartType - Loại biểu đồ ('bar', 'line', etc.)
 * @param {boolean} horizontal - Biểu đồ cột có ngang hay không
 * @returns {number} Chiều cao tính toán cho biểu đồ
 */
Helper.calculateChartHeight = function(dataLength, chartType = 'bar', horizontal = false) {
  // Chiều cao tối thiểu
  const minHeight = 350;
  
  // Với biểu đồ cột ngang, mỗi cột cần khoảng 30px
  if (chartType === 'bar' && horizontal) {
    // Tính chiều cao dựa trên số lượng dữ liệu
    const calculatedHeight = Math.max(dataLength * 30, minHeight);
    
    // Giới hạn chiều cao tối đa để tránh biểu đồ quá lớn
    return Math.min(calculatedHeight, 1000);
  }
  
  // Với các loại biểu đồ khác, có thể áp dụng các quy tắc khác
  // Ví dụ: biểu đồ đường có thể cần ít chiều cao hơn
  if (chartType === 'line') {
    return minHeight;
  }
  
  // Trường hợp mặc định
  return minHeight;
};

// Thêm Helper vào window để các script khác có thể sử dụng
window.Helper = Helper;