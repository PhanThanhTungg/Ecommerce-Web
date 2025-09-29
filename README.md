# EcommerceWeb (ExpressJS)

source prediction model server: <a href="https://github.com/PhanThanhTungg/ModelProfetHTTTQL.git">github</a><br>
source cube.js server: <a href="https://github.com/PhanThanhTungg/CubeHTTTQL">github</a><br>
source data Crawling server: <a href="https://github.com/PhanThanhTungg/crawl_data_ecommerce.git">github</a><br>


Dự án website thương mại điện tử (bán đồ nội thất) xây dựng bằng Node.js/Express, MongoDB (OLTP), tích hợp Data Warehouse (MSSQL) và Pug cho server-side rendering. Hỗ trợ đăng nhập OAuth (Google/Facebook/GitHub), Socket.io realtime, Tailwind CSS và thanh toán online.

---

## Tính năng chính
- Quản trị: sản phẩm, danh mục, đơn hàng, khuyến mãi, người dùng, vai trò/quyền, cài đặt
- Client: xem sản phẩm, giỏ hàng, thanh toán, lịch sử đơn hàng, đánh giá/feedback
- Tích hợp map: tự động tính phí vận chuyển theo khoảng cách 
- Đăng nhập OAuth: Google, Facebook, GitHub
- Realtime với Socket.io
- Data Warehouse: etl dữ liệu sang warehouse dùng mssql
- Giao diện SSR sử dụng Pug, kết hợp Tailwind CSS
- Tích hợp chatbot với botpress

---

## Cài đặt và chạy
1) Cài dependencies:
```bash
npm install
```

2) Biên dịch Tailwind (nên chạy khi phát triển):
```bash
npm run tailwind
```

3) Chạy server (hot reload với nodemon):
```bash
npm start
```

- Ứng dụng chạy tại `http://localhost:<PORT>`
- Static: thư mục `public/`; View engine: Pug (`views/`)
- Trang quản trị: `/<prefixAdmin>` (mặc định `/admin`)

---

## Biến môi trường (.env)
Tạo file `.env` ở thư mục gốc theo mẫu:
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/ecommerce_db
CLOUD_NAME=your_cloudinary_name
CLOUD_KEY=your_cloudinary_key
CLOUD_SECRET=your_cloudinary_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

SESSION_SECRET=your_session_secret_key
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_SECRET_EXPIRE=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_SECRET_EXPIRE=7d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BASE_URL=http://localhost:3000

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

ZALO_APP_ID=your_zalo_app_id
ZALO_KEY1=your_zalo_key1
ZALO_KEY2=your_zalo_key2
ZALO_ENDPOINT=https://sb-openapi.zalopay.vn/v2/create

QR_BANK_ID=your_bank_name
QR_BANK_ACC=your_bank_account

PUBLIC_URL=https://your-ngrok-url.ngrok-free.app

SEPAY_TOKEN_API=your_sepay_token

URLDEPLOY=https://your-deploy-url.ngrok-free.app
SUB_URLDEPLOY=http://localhost:3000
USER_ZALOPAY=your_zalopay_user
APP_ID=your_zalo_app_id
KEY1=your_zalo_key1
KEY2=your_zalo_key2
ZALOPAY_ENDPOINT=https://sb-openapi.zalopay.vn/v2/create

MOMO_ACCESS_KEY=your_momo_access_key
MOMO_SECRET_KEY=your_momo_secret_key

MSSQL_SA_PASSWORD=your_mssql_password
MSSQL_HOST=localhost
MSSQL_PORT=1433

CUBEJS_API_URL=http://localhost:4000/cubejs-api/v1/load
CUBEJS_TOKEN=your_cubejs_token

PROFET_API_URL=http://localhost:5000
```
Ghi chú:
- `BASE_URL` dùng cho callback OAuth: `${BASE_URL}/user/<provider>/callback`
- MoMo cấu hình tại `config/momo.config.js` dùng `URLDEPLOY` và `SUB_URLDEPLOY`
- MongoDB đọc từ `config/database.js` qua `MONGO_URL`
- MSSQL (DWH) cấu hình trong `DWH/connectToMSSQL.js`

---

## Cấu trúc thư mục
```text
config/        # Cấu hình hệ thống, DB, passport, momo
controller/    # Controller admin và client
DWH/           # Data Warehouse (MSSQL, Sequelize)
helpers/       # Helper
middlewares/   # Middleware admin/client
model/         # Mongoose models
public/        # Tài nguyên tĩnh (css, js, images)
routes/        # Định tuyến admin/client và API
validate/      # Validate
views/         # Pug templates (admin & client)
index.js       # Entry point
```

---

## Scripts npm
```json
{
  "start": "nodemon index.js",
  "tailwind": "npx @tailwindcss/cli -i ./public/tailwind/input.css -o ./public/tailwind/output.css --watch"
}
```
- Khi phát triển UI, chạy đồng thời `npm run tailwind` và `npm start`
