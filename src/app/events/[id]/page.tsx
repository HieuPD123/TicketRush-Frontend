'use client';

import { useState, useEffect, use } from 'react';
import {
  ArrowLeft,
  Wallet,
  Ticket,
  TrendingUp,
  MapPin,
  Calendar,
  Lock,
} from 'lucide-react';

import { apiService } from '@/services/apiService';
import type { Event } from '@/types';
import Link from 'next/link';

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await apiService.getEventById(Number(id));
        setEvent(data);
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-white/40 font-bold animate-pulse">
        Đang tải thông tin sự kiện...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-10 text-center text-red-400 font-bold">
        Không tìm thấy sự kiện
      </div>
    );
  }

  const totalSeats =
    event.zones?.reduce(
      (sum, zone) => sum + (zone.totalSeats || 0),
      0
    ) || 0;

  const availableSeats =
    event.zones?.reduce(
      (sum, zone) => sum + (zone.availableSeats || 0),
      0
    ) || 0;

  const soldSeats = totalSeats - availableSeats;

  const totalRevenue =
    event.zones?.reduce((sum, zone) => {
      const sold =
        (zone.totalSeats || 0) -
        (zone.availableSeats || 0);

      return sum + sold * (zone.price || 0);
    }, 0) || 0;

  const fillRate =
    totalSeats > 0
      ? ((soldSeats / totalSeats) * 100).toFixed(1)
      : '0';

  const seatStates =
    event.zones?.flatMap(zone => {
      const seats = [];

      const sold =
        (zone.totalSeats || 0) -
        (zone.availableSeats || 0);

      for (let i = 0; i < sold; i++) {
        seats.push({
          state: 'sold',
          color: zone.colorHex,
        });
      }

      for (let i = 0; i < (zone.availableSeats || 0); i++) {
        seats.push({
          state: 'available',
          color: zone.colorHex,
        });
      }

      return seats;
    }) || [];

  return (
    <div className="space-y-8 font-sans">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link
          href="/events"
          className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-white/50"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div>
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">
              {event.title}
            </h2>

            <span
              className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${
                event.status === 'ON SALE'
                  ? 'bg-ticketbox-green/10 text-ticketbox-green border-ticketbox-green/20'
                  : 'bg-white/10 text-white/50 border-white/10'
              }`}
            >
              {event.status === 'ON SALE'
                ? 'Đang bán'
                : 'Đã đóng'}
            </span>
          </div>

          <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-1">
            Chi tiết hiệu suất và quản lý chỗ ngồi
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Doanh thu thu về',
            value: `${(totalRevenue / 1000000).toFixed(1)}M`,
            sub: 'VND',
            trend: '+8.2%',
            color: 'primary',
            icon: Wallet,
          },
          {
            label: 'Vé đã bán',
            value: soldSeats,
            sub: `/ ${totalSeats}`,
            trend: `${fillRate}%`,
            progress: true,
            color: 'secondary',
            icon: Ticket,
          },
          {
            label: 'Ghế còn trống',
            value: availableSeats,
            sub: 'Có thể đặt',
            color: 'emerald',
            icon: Lock,
          },
          {
            label: 'Giá vé trung bình',
            value: `${
              event.zones?.length
                ? (
                    event.zones.reduce(
                      (sum, z) => sum + z.price,
                      0
                    ) /
                    event.zones.length /
                    1000000
                  ).toFixed(1)
                : 0
            }M`,
            sub: 'VND',
            trend: 'Ổn định',
            color: 'black',
            icon: TrendingUp,
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-pure-black rounded-2xl p-8 shadow-2xl border border-white/5 group hover:border-white/10 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                {card.label}
              </p>

              <div
                className={`p-2 rounded-lg ${
                  card.color === 'primary'
                    ? 'bg-ticketbox-green/10 text-ticketbox-green'
                    : card.color === 'secondary'
                      ? 'bg-white text-black'
                      : card.color === 'emerald'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-white/5 text-white/30'
                }`}
              >
                <card.icon className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-white">
                {card.value}
              </h3>

              <span className="text-xs font-bold text-white/30">
                {card.sub}
              </span>
            </div>

            {card.progress ? (
              <div className="mt-4 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-1000"
                  style={{ width: `${fillRate}%` }}
                />
              </div>
            ) : (
              <div className="mt-3 flex items-center gap-1">
                <span className="text-[10px] font-black text-ticketbox-green">
                  {card.trend}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SEAT MAP */}
        <div className="lg:col-span-8 bg-pure-black rounded-3xl shadow-2xl border border-white/5 p-12 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-8 left-8 flex items-center gap-2">
            <div className="w-2 h-2 bg-ticketbox-green rounded-full animate-pulse" />

            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
              Trạng thái thời gian thực
            </span>
          </div>

          <div className="w-full max-w-xl h-10 bg-white rounded-t-[40px] flex items-center justify-center text-black/20 text-[10px] font-black tracking-[0.8em] mb-12 shadow-2xl uppercase">
            SÂN KHẤU
          </div>

          <div className="grid grid-cols-12 gap-2 w-full max-w-3xl justify-center">
            {seatStates.map((seat, i) => (
              <div
                key={i}
                className={`w-full pt-[100%] rounded-md transition-all ${
                  seat.state === 'sold'
                    ? 'opacity-100'
                    : 'opacity-40 border border-white/10'
                }`}
                style={{
                  backgroundColor:
                    seat.state === 'sold'
                      ? seat.color
                      : 'transparent',
                }}
              />
            ))}
          </div>
        </div>

        {/* INFO */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-pure-black rounded-3xl shadow-2xl border border-white/5 p-8 space-y-8">
            <h3 className="font-black text-xl text-white uppercase tracking-tighter">
              Thông tin địa điểm
            </h3>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-ticketbox-green">
                  <MapPin className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-sm font-black text-white">
                    {event.revenue}
                  </p>

                  <p className="text-[10px] font-black text-white/30 mt-1 uppercase tracking-wider">
                    Địa điểm tổ chức
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-ticketbox-green">
                  <Calendar className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-sm font-black text-white">
                    {event.startTime
                      ? new Date(event.startTime).toLocaleDateString('vi-VN')
                      : '(Chưa có thời gian)'}
                  </p>

                  <p className="text-[10px] font-black text-white/30 mt-1 uppercase tracking-wider">
                    {event.startTime
                      ? new Date(event.startTime).toLocaleTimeString('vi-VN')
                      : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* ZONES */}
            <div className="pt-8 border-t border-white/5">
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-6">
                Chi tiết hạng vé
              </h4>

              <div className="space-y-4">
                {event.zones?.map(zone => (
                  <div
                    key={zone.id}
                    className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: zone.colorHex,
                        }}
                      />

                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                        {zone.name}
                      </span>
                    </div>

                    <span className="font-black text-ticketbox-green text-sm">
                      {zone.price.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FILL RATE */}
          <div className="bg-ticketbox-green rounded-3xl p-8 text-black relative overflow-hidden shadow-2xl">
            <h3 className="text-xl font-black mb-2 uppercase tracking-widest">
              Tỉ lệ lấp đầy
            </h3>

            <p className="text-black/40 text-[10px] mb-8 uppercase font-black tracking-widest">
              Hiệu suất bán vé hiện tại
            </p>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-6xl font-black leading-none">
                {fillRate}
              </span>

              <span className="text-2xl font-black">%</span>
            </div>

            <div className="w-full bg-black/10 rounded-full h-3 mb-8 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-1000"
                style={{ width: `${fillRate}%` }}
              />
            </div>

            <button className="w-full bg-black text-white font-black py-4 rounded-2xl hover:bg-neutral-900 active:scale-95 transition-all uppercase tracking-widest text-xs">
              Gửi báo cáo doanh thu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}