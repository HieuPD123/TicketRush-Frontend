# 🎨 Hướng Dẫn Frontend Tích Hợp Hàng Chờ — TicketRush

## Tổng Quan Flow

```
User vào Event Detail
       │
       ▼
  GET /api/events/{id}/detail
       │
       ├── queueRequired = false → Đặt vé bình thường (không cần token)
       │
       └── queueRequired = true → Hiện UI hàng chờ
                │
                ▼
         POST /api/queue/join/{eventId}
                │
                ▼
         Nhận token + position
                │
                ▼
         Subscribe WebSocket /topic/queue/{eventId}
         + Gọi heartbeat mỗi 30s
                │
                ▼
         Nhận message status = "GRANTED"
                │
                ▼
         Cho phép chọn ghế + đặt vé
         POST /api/bookings { seatIds, queueToken }
```

---

## API Reference

### 1. Lấy Event Detail (có queue info)

```
GET /api/events/{eventId}/detail
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "code": 1000,
  "result": {
    "id": 1,
    "title": "Concert ABC",
    "venue": "...",
    "startTime": "2026-06-01 20:00:00",
    "status": "ON_SALE",
    "zones": [...],
    "queueRequired": true,
    "activeUsers": 15
  }
}
```

### 2. Join Queue

```
POST /api/queue/join/{eventId}
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "code": 1000,
  "result": {
    "token": "550e8400-e29b-41d4-a716-446655440000",
    "position": 5,
    "totalInQueue": 12,
    "message": "Vui lòng chờ, đừng tải lại trang"
  }
}
```

### 3. Check Queue Status (polling fallback)

```
GET /api/queue/status/{token}
```

**Response:**
```json
{
  "code": 1000,
  "result": {
    "token": "550e8400-...",
    "status": "WAITING",       // WAITING | GRANTED | EXPIRED
    "position": 3,
    "totalInQueue": 10,
    "estimatedWaitSeconds": 60
  }
}
```

### 4. Heartbeat (giữ session active)

```
POST /api/queue/heartbeat/{eventId}
Authorization: Bearer <jwt_token>
```

> Gọi mỗi **30 giây** để backend biết user vẫn đang ở trang event.

### 5. Đặt vé (có queue token)

```
POST /api/bookings
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "seatIds": [1, 2, 3],
  "queueToken": "550e8400-..."    // null nếu event không yêu cầu queue
}
```

---

## WebSocket Integration

### Kết nối

```javascript
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const client = new Client({
  webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
  onConnect: () => {
    console.log('WebSocket connected');
    
    // Subscribe queue updates cho event đang xem
    client.subscribe(`/topic/queue/${eventId}`, (message) => {
      const data = JSON.parse(message.body);
      // data = { eventId, token, status, position, totalInQueue, estimatedWaitSeconds }
      handleQueueUpdate(data);
    });
  },
});

client.activate();
```

### Xử lý message

```javascript
function handleQueueUpdate(data) {
  // Chỉ quan tâm message của token mình
  if (data.token !== myQueueToken) return;

  switch (data.status) {
    case 'GRANTED':
      // ✅ Được phép đặt vé!
      showBookingUI();
      break;
    case 'WAITING':
      // Cập nhật vị trí
      updatePosition(data.position, data.totalInQueue, data.estimatedWaitSeconds);
      break;
    case 'EXPIRED':
      // Token hết hạn
      showExpiredMessage();
      break;
  }
}
```

---

## Code Mẫu React

```jsx
import { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import api from '../utils/api'; // axios instance

export default function EventDetailPage({ eventId }) {
  const [event, setEvent] = useState(null);
  const [queueRequired, setQueueRequired] = useState(false);
  const [queueToken, setQueueToken] = useState(null);
  const [queueStatus, setQueueStatus] = useState(null); // WAITING | GRANTED
  const [position, setPosition] = useState(0);
  const [totalInQueue, setTotalInQueue] = useState(0);
  const [estimatedWait, setEstimatedWait] = useState(0);
  const stompClient = useRef(null);

  // 1) Lấy event detail + queue info
  useEffect(() => {
    api.get(`/events/${eventId}/detail`).then(res => {
      setEvent(res.data.result);
      setQueueRequired(res.data.result.queueRequired);
    });
  }, [eventId]);

  // 2) Nếu cần queue → tự động join
  useEffect(() => {
    if (!queueRequired) return;

    api.post(`/queue/join/${eventId}`).then(res => {
      const data = res.data.result;
      setQueueToken(data.token);
      setPosition(data.position);
      setTotalInQueue(data.totalInQueue);

      // Nếu đã GRANTED từ trước (user đã join trước đó)
      if (data.position === 0) {
        setQueueStatus('GRANTED');
      } else {
        setQueueStatus('WAITING');
      }
    });
  }, [queueRequired, eventId]);

  // 3) WebSocket subscribe để nhận push
  useEffect(() => {
    if (!queueToken || queueStatus === 'GRANTED') return;

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        client.subscribe(`/topic/queue/${eventId}`, (message) => {
          const data = JSON.parse(message.body);
          if (data.token !== queueToken) return;

          if (data.status === 'GRANTED') {
            setQueueStatus('GRANTED');
            setPosition(0);
          } else {
            setPosition(data.position);
            setTotalInQueue(data.totalInQueue);
            setEstimatedWait(data.estimatedWaitSeconds);
          }
        });
      },
    });

    client.activate();
    stompClient.current = client;

    return () => client.deactivate();
  }, [queueToken, queueStatus, eventId]);

  // 4) Heartbeat mỗi 30s
  useEffect(() => {
    const interval = setInterval(() => {
      api.post(`/queue/heartbeat/${eventId}`).catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, [eventId]);

  // 5) Fallback polling mỗi 10s (nếu WebSocket không hoạt động)
  useEffect(() => {
    if (!queueToken || queueStatus === 'GRANTED') return;

    const interval = setInterval(() => {
      api.get(`/queue/status/${queueToken}`).then(res => {
        const data = res.data.result;
        if (data.status === 'GRANTED') {
          setQueueStatus('GRANTED');
          setPosition(0);
        } else {
          setPosition(data.position);
          setTotalInQueue(data.totalInQueue);
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [queueToken, queueStatus]);

  // ========== RENDER ==========

  if (!event) return <div>Loading...</div>;

  // Đang chờ trong hàng đợi
  if (queueStatus === 'WAITING') {
    return (
      <div className="queue-waiting">
        <h1>{event.title}</h1>
        <div className="queue-overlay">
          <h2>🕐 Bạn đang trong hàng chờ</h2>
          <p>Vị trí: <strong>{position}</strong> / {totalInQueue}</p>
          <p>Thời gian chờ ước tính: ~{estimatedWait}s</p>
          <div className="progress-bar">
            <div style={{ width: `${Math.max(5, 100 - (position / totalInQueue) * 100)}%` }} />
          </div>
          <p className="warning">⚠️ Đừng tải lại trang!</p>
        </div>
      </div>
    );
  }

  // Được phép đặt vé (GRANTED hoặc không cần queue)
  return (
    <div className="event-detail">
      <h1>{event.title}</h1>
      {queueStatus === 'GRANTED' && (
        <div className="granted-banner">
          ✅ Bạn đã được phép đặt vé! Vui lòng chọn ghế trong 10 phút.
        </div>
      )}
      {/* Component chọn ghế + đặt vé */}
      <SeatPicker 
        eventId={eventId} 
        queueToken={queueToken}  // truyền token cho booking request
      />
    </div>
  );
}
```

---

## Xử Lý Edge Cases

| Case | Xử lý |
|---|---|
| **User refresh trang** | `joinQueue` sẽ trả lại token cũ + vị trí hiện tại (idempotent) |
| **Token GRANTED hết hạn** (10 phút) | `isGranted` trả false → hiển thị "Hết thời gian, vui lòng thử lại" |
| **Queue bị deactivate** (người rời đi) | `queueRequired` trả false → cho đặt trực tiếp |
| **WebSocket mất kết nối** | Fallback polling mỗi 10s qua `GET /queue/status/{token}` |
| **User đã GRANTED mà join lại** | API trả `position: 0` + message "Bạn đã được cấp quyền" |

---

## Dependencies cần cài (React)

```bash
npm install sockjs-client @stomp/stompjs
```
