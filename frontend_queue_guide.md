# 🎨 Hướng Dẫn Frontend Tích Hợp Hàng Chờ — TicketRush

## Tổng Quan Flow

```
User vào Event Detail
       │
       ▼
  GET /api/events/{id}/detail
       │
       ├── queueRequired = false → bấm nút đặt vé -> Đặt vé bình thường (không cần token)
       │
       └── queueRequired = true → bấm nút đặt vé -> gọi  POST /api/queue/join/{eventId} -> Hiện UI hàng chờ
                │
                ▼
         Nhận token + position, mở socket subcribe topic
                │
                ▼
         + Gọi heartbeat mỗi 30s
                │
                ▼
         Nhận message status = "GRANTED"
                │
                ▼
         Cho phép chọn ghế + đặt vé
         POST /api/bookings { seatIds, queueToken }
Xử Lý Edge Cases

|Case|Xử lý|
|-|-|
|\\\*\\\*User refresh trang\\\*\\\*|`joinQueue` sẽ trả lại token cũ + vị trí hiện tại (idempotent)|
|\\\*\\\*Token GRANTED hết hạn\\\*\\\* (10 phút)|`isGranted` trả false → hiển thị "Hết thời gian, vui lòng thử lại"|
|\\\*\\\*Queue bị deactivate\\\*\\\* (nhiều người rời đi, event hết trạng thái phải queue)|`queueRequired` trả false → cho đặt trực tiếp|
|\\\*\\\*User đã GRANTED mà join lại (chưa hết 10p)\\\*\\\*|API trả `position: 0` + message "Bạn đã được cấp quyền"|
|||



Thêm UI:

nếu event queueRequired = true khi vào đặt ghế thành công token granted rồi, sẽ có notification: Bạn có 10 phút để chọn ghế
Khi thanh toán,(không phụ thuộc vào queueRequired), sẽ có notification Bạn có 10 phút để hoàn tất thanh toán
yêu cầu notification: toast notification auto close with progress border để màu hợp theme
tạo hooks, tách biệt UI với logic

Message WebSocket

Khi user dang cho:

```json
{
  "eventId": 12,
  "status": "WAITING",
  "position": 5,
  "totalInQueue": 20,
  "estimatedWaitSeconds": 60
}
```

Khi user duoc phep vao dat ve:

```json
{
  "eventId": 12,
  "status": "GRANTED",
  "position": 0,
  "totalInQueue": 10,
  "estimatedWaitSeconds": 0
}
```

Y nghia status:

|Status|Y nghia|Frontend nen lam|
|-|-|-|
|`WAITING`|User van dang trong hang cho|Cap nhat vi tri, tong so nguoi, thoi gian uoc tinh|
|`GRANTED`|User da duoc cap quyen dat ve|Dieu huong sang man hinh booking|
|`EXPIRED`|Token hang cho het han|Hien thong bao va cho join lai|





