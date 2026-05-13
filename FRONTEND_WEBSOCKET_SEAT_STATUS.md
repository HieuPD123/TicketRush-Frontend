# Hướng Dẫn Frontend Cập Nhật Tình Trạng Ghế Real-Time Qua WebSocket

Tài liệu này hướng dẫn frontend dùng WebSocket/STOMP để cập nhật trạng thái ghế theo thời gian thực trên màn hình chọn ghế.

## Tổng Quan

Backend đang dùng Spring WebSocket với STOMP + SockJS.

- WebSocket endpoint: `http://localhost:8080/ws`
- Topic nhận cập nhật ghế: `/topic/events/{eventId}/seats`
- API lấy danh sách ghế ban đầu: `GET /api/events/{eventId}/seats`

Frontend không cần gửi message WebSocket để giữ ghế. Việc giữ ghế vẫn gọi API booking như hiện tại. WebSocket chỉ dùng để nhận broadcast khi trạng thái ghế thay đổi.

## Trạng Thái Ghế

Backend trả về 3 trạng thái:

| Status | Ý nghĩa | UI gợi ý |
| --- | --- | --- |
| `AVAILABLE` | Ghế còn trống | Cho phép chọn |
| `LOCKED` | Ghế đang được giữ trong booking pending | Không cho người khác chọn |
| `SOLD` | Ghế đã thanh toán thành công | Không cho chọn |

## Luồng Tích Hợp Trên Màn Chọn Ghế

1. Khi vào trang event detail hoặc seat map, gọi REST API để lấy snapshot ban đầu:

```http
GET /api/events/{eventId}/seats
```

Response dạng:

```json
{
  "code": 1000,
  "result": [
    {
      "id": 1,
      "zoneId": 2,
      "zoneName": "VIP",
      "colorHex": "#FFCC00",
      "price": 1500000,
      "rowNumber": 1,
      "colNumber": 1,
      "label": "A1",
      "status": "AVAILABLE"
    }
  ]
}
```

2. Sau khi có `eventId`, mở kết nối WebSocket tới `/ws`.

3. Subscribe topic:

```text
/topic/events/{eventId}/seats
```

Ví dụ event id là `12`:

```text
/topic/events/12/seats
```

4. Mỗi message WebSocket là một thay đổi trạng thái của một ghế:

```json
{
  "eventId": 12,
  "seatId": 35,
  "label": "B5",
  "status": "LOCKED"
}
```

5. Frontend update ghế trong state theo `seatId`.

## Khi Nào Backend Broadcast?

Backend tự broadcast qua WebSocket trong các tình huống sau:

- User giữ ghế thành công qua `POST /api/bookings`: ghế chuyển sang `LOCKED`.
- User xác nhận thanh toán qua `POST /api/bookings/{bookingId}/confirm`: ghế chuyển sang `SOLD`.
- User hủy booking qua `DELETE /api/bookings/{bookingId}`: ghế chuyển về `AVAILABLE`.
- Booking pending hết hạn sau khoảng 10 phút và scheduler release ghế: ghế chuyển về `AVAILABLE`.

## Cài Thư Viện

```bash
npm install @stomp/stompjs sockjs-client
```

Nếu project dùng TypeScript và thiếu type của SockJS:

```bash
npm install -D @types/sockjs-client
```

## Ví Dụ React/TypeScript

```ts
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export type SeatStatus = "AVAILABLE" | "LOCKED" | "SOLD";

export type Seat = {
  id: number;
  zoneId: number;
  zoneName: string;
  colorHex: string;
  price: number;
  rowNumber: number;
  colNumber: number;
  label: string;
  status: SeatStatus;
};

type SeatStatusMessage = {
  eventId: number;
  seatId: number;
  label: string;
  status: SeatStatus;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export async function fetchEventSeats(eventId: number): Promise<Seat[]> {
  const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/seats`);
  const body = await response.json();

  if (body.code !== 1000) {
    throw new Error(body.message ?? "Cannot fetch seats");
  }

  return body.result;
}

export function createSeatStatusClient(
  eventId: number,
  onSeatStatusChange: (message: SeatStatusMessage) => void,
  onReconnect?: () => void
) {
  let hasConnectedBefore = false;

  const client = new Client({
    webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws`),
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    onConnect: () => {
      if (hasConnectedBefore) {
        onReconnect?.();
      }
      hasConnectedBefore = true;

      client.subscribe(`/topic/events/${eventId}/seats`, (message: IMessage) => {
        const payload = JSON.parse(message.body) as SeatStatusMessage;

        if (payload.eventId !== eventId) {
          return;
        }

        onSeatStatusChange(payload);
      });
    },
    onStompError: (frame) => {
      console.error("STOMP error", frame.headers.message, frame.body);
    },
    onWebSocketError: (event) => {
      console.error("WebSocket error", event);
    },
  });

  client.activate();

  return () => {
    client.deactivate();
  };
}
```

Ví dụ dùng trong component:

```tsx
import { useEffect, useState } from "react";
import { createSeatStatusClient, fetchEventSeats, type Seat } from "./seatRealtime";

type Props = {
  eventId: number;
};

export function SeatMap({ eventId }: Props) {
  const [seats, setSeats] = useState<Seat[]>([]);

  async function reloadSeats() {
    const data = await fetchEventSeats(eventId);
    setSeats(data);
  }

  useEffect(() => {
    reloadSeats();

    const disconnect = createSeatStatusClient(
      eventId,
      (message) => {
        setSeats((currentSeats) =>
          currentSeats.map((seat) =>
            seat.id === message.seatId
              ? { ...seat, status: message.status }
              : seat
          )
        );
      },
      reloadSeats
    );

    return disconnect;
  }, [eventId]);

  return (
    <div>
      {seats.map((seat) => (
        <button
          key={seat.id}
          disabled={seat.status !== "AVAILABLE"}
          data-status={seat.status}
        >
          {seat.label}
        </button>
      ))}
    </div>
  );
}
```

## Xử Lý Khi User Chọn Và Giữ Ghế

Khi user bấm giữ ghế, frontend vẫn gọi REST API:

```http
POST /api/bookings
Authorization: Bearer {accessToken}
Content-Type: application/json
```

Body:

```json
{
  "seatIds": [35, 36],
  "queueToken": null
}
```

Nếu event đang yêu cầu hàng chờ, gửi kèm `queueToken` đã được cấp:

```json
{
  "seatIds": [35, 36],
  "queueToken": "queue-token-value"
}
```

Sau khi API giữ ghế thành công, backend sẽ broadcast `LOCKED` cho các ghế đó. Frontend có thể update UI ngay theo response API để cảm giác nhanh hơn, nhưng vẫn nên nhận WebSocket như source cập nhật chung cho tất cả client.

Nếu API trả lỗi ghế không còn khả dụng, frontend cần reload lại danh sách ghế hoặc chờ WebSocket update. Không nên chỉ dựa vào state local để quyết định ghế còn mua được hay không, vì có thể user khác đã giữ ghế trước đó.

## Best Practices Cho Frontend

- Luôn lấy snapshot ban đầu bằng REST trước khi hiển thị seat map.
- Luôn unsubscribe/deactivate WebSocket khi rời trang hoặc đổi `eventId`.
- Khi reconnect thành công, gọi lại `GET /api/events/{eventId}/seats` để đồng bộ các message có thể đã bị miss trong lúc mất kết nối.
- Dùng `seatId` để update state, không dùng `label` vì label chỉ để hiển thị.
- Disable click với ghế `LOCKED` hoặc `SOLD`.
- Khi nhận update cho ghế đang được user chọn local nhưng chưa gọi booking, nếu status chuyển khỏi `AVAILABLE` thì bỏ ghế đó khỏi danh sách đang chọn.
- WebSocket hiện tại không yêu cầu auth header. Các API booking vẫn cần JWT theo flow đăng nhập.

## Mapping Màu UI Gợi Ý

Frontend có thể tự map theo design system:

```ts
const seatStatusColor = {
  AVAILABLE: "var(--seat-available)",
  LOCKED: "var(--seat-locked)",
  SOLD: "var(--seat-sold)",
};
```

Với ghế còn trống, có thể kết hợp `colorHex` của zone để hiển thị khu vực. Với ghế `LOCKED` hoặc `SOLD`, nên ưu tiên màu trạng thái để người dùng nhận biết rõ là không thể chọn.

## Checklist Tích Hợp

- [ ] Cài `@stomp/stompjs` và `sockjs-client`.
- [ ] Gọi `GET /api/events/{eventId}/seats` khi vào seat map.
- [ ] Connect SockJS tới `${API_BASE_URL}/ws`.
- [ ] Subscribe `/topic/events/{eventId}/seats`.
- [ ] Update state theo `seatId` và `status`.
- [ ] Cleanup connection khi unmount hoặc đổi event.
- [ ] Refetch seats sau reconnect.
- [ ] Disable ghế `LOCKED` và `SOLD`.
- [ ] Xử lý lỗi khi booking thất bại do ghế không còn khả dụng.
