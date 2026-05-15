'use client';

import { useState, useEffect, use } from 'react';
import {
  ArrowLeft,
  Wallet,
  Ticket,
  MapPin,
  Calendar,
  Lock,
  Clock,
} from 'lucide-react';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

import { apiService } from '@/services/apiService';
import type { Event, EventStats } from '@/types';
import Link from 'next/link';


export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [event, setEvent] = useState<Event | null>(
    null
  );

  const [seatData, setSeatData] = useState<any[]>(
    []
  );

  const [eventStats, setEventStats] = useState<EventStats | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data =
          await apiService.getEventById(
            Number(id)
          );

        const dataSeats =
          await apiService.getSeatsByEventId(
            Number(id)
          );

        const stats = await apiService.getEventStatsById(
          Number(id)
        );

        setEventStats(stats);
        setEvent(data);
        setSeatData(dataSeats || []);
      } catch (error) {
        console.error(
          'Failed to fetch event:',
          error
        );
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
      (sum, zone) =>
        sum + (zone.totalSeats || 0),
      0
    ) || 0;

  const availableSeats =
    event.zones?.reduce(
      (sum, zone) =>
        sum + (zone.availableSeats || 0),
      0
    ) || 0;

  const lockedSeats = seatData.filter(
    seat => seat.status === 'LOCKED'
  ).length;

  const soldSeats =
    totalSeats -
    availableSeats -
    lockedSeats;

  const totalRevenue =
    event.zones?.reduce((sum, zone) => {
      const sold =
        (zone.totalSeats || 0) -
        (zone.availableSeats || 0);

      return (
        sum + sold * (zone.price || 0)
      );
    }, 0) || 0;

  const fillRate =
    totalSeats > 0
      ? (
          (soldSeats / totalSeats) *
          100
        ).toFixed(1)
      : '0';

  const seatMapByZone: Record<
    number,
    Record<string, any>
  > = {};

  seatData.forEach((seat: any) => {
    if (!seatMapByZone[seat.zoneId]) {
      seatMapByZone[seat.zoneId] = {};
    }

    seatMapByZone[seat.zoneId][
      `${seat.rowNumber}_${seat.colNumber}`
    ] = seat;
  });

  return (
    <div className="space-y-8 font-sans">
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
            Chi tiết hiệu suất và quản lý
            chỗ ngồi
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Doanh thu thu về',
            value: `${(
              totalRevenue / 1000000
            ).toFixed(1)}M`,
            sub: 'VND',
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
            label: 'Đang giữ chỗ',
            value: lockedSeats,
            sub: 'Đang xử lý',
            trend: 'Thanh toán',
            color: 'emerald',
            icon: Clock,
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
                    : card.color ===
                        'secondary'
                      ? 'bg-white text-black'
                      : 'bg-emerald-500/10 text-emerald-500'
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
                  style={{
                    width: `${fillRate}%`,
                  }}
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

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-pure-black rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                Phân tích giới tính
              </h3>

              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">
                Tỉ lệ người tham gia
              </p>
            </div>

            <div className="w-2 h-2 rounded-full bg-ticketbox-green animate-pulse" />
          </div>

          <div className="p-8 flex items-center gap-10">
            <div className="w-44 h-44 shrink-0">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={eventStats?.genderStats || []}
                    innerRadius={60}
                    outerRadius={82}
                    paddingAngle={6}
                    dataKey="percentage"
                    stroke="none"
                  >
                    <Cell fill="#24C373" />
                    <Cell fill="#ffffff15" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 space-y-5">
              {eventStats?.genderStats.map(
                (genderStat, index) => (
                  <div
                    key={index}
                    className="bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          index === 0
                            ? 'bg-ticketbox-green'
                            : 'bg-white/20'
                        }`}
                      />

                      <div>
                        <p className="text-sm font-black text-white uppercase tracking-wider">
                          {
                            genderStat.gender
                          }
                        </p>

                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                          Audience
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-black text-white">
                        {
                          genderStat.percentage
                        }
                        %
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="bg-pure-black rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
          <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                Phân tích độ tuổi
              </h3>

              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">
                Phân bố người tham gia
              </p>
            </div>

            <div className="w-2 h-2 rounded-full bg-ticketbox-green animate-pulse" />
          </div>

          <div className="p-8 space-y-6">
            {eventStats?.ageGroupStats.map(
              (ageStat, i) => (
                <div
                  key={i}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-wider">
                        {
                          ageStat.ageGroup
                        }
                      </p>

                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                        Nhóm tuổi
                      </p>
                    </div>

                    <span className="text-lg font-black text-ticketbox-green">
                      {
                        ageStat.percentage
                      }
                      %
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-ticketbox-green rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(36,195,115,0.35)]"
                      style={{
                        width: `${ageStat.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-pure-black rounded-3xl shadow-2xl border border-white/5 p-12 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-8 left-8 flex items-center gap-2">
            <div className="w-2 h-2 bg-ticketbox-green rounded-full animate-pulse" />

            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
              Trạng thái thời gian thực
            </span>
          </div>

          <div className="w-full max-w-xl h-12 bg-white rounded-t-[40px] flex items-center justify-center text-black/20 text-[10px] font-black tracking-[0.8em] mb-12 shadow-2xl uppercase">
            SÂN KHẤU
          </div>

          <div className="overflow-auto max-h-[650px] w-full flex justify-center p-4">
            <div className="w-full max-w-5xl space-y-10">
              {event.zones?.map(zone => {
                const cols =
                  zone.totalCols || 1;

                const rows =
                  zone.totalRows || 1;

                const map =
                  seatMapByZone[
                    zone.id
                  ] || {};

                return (
                  <div
                    key={zone.id}
                    className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-inner"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-5 h-5 rounded shadow-sm"
                          style={{
                            backgroundColor:
                              zone.colorHex,
                          }}
                        />

                        <div>
                          <h3 className="text-sm font-black text-white uppercase tracking-widest">
                            {zone.name}
                          </h3>

                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">
                            {rows} hàng •{' '}
                            {cols} ghế
                          </p>
                        </div>
                      </div>

                      <div className="text-sm font-black text-ticketbox-green">
                        {zone.price.toLocaleString(
                          'vi-VN'
                        )}
                        ₫
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 items-center">
                      {Array.from({
                        length: rows,
                      }).map((_, r) => {
                        return (
                          <div
                            key={r}
                            className="flex items-center gap-3"
                          >
                            <div className="w-6 text-center text-[10px] font-black text-white/20">
                              {String.fromCharCode(
                                65 + r
                              )}
                            </div>

                            <div className="flex gap-2.5">
                              {Array.from({
                                length: cols,
                              }).map((_, c) => {
                                const row =
                                  r + 1;

                                const col =
                                  c + 1;

                                const seat =
                                  map[
                                    `${row}_${col}`
                                  ];

                                const status =
                                  seat?.status ||
                                  'AVAILABLE';

                                return (
                                  <div
                                    key={`${row}_${col}`}
                                    className={`
                                      w-8 h-8 rounded-lg shadow-sm transition-all
                                      hover:scale-125 cursor-pointer
                                      flex items-center justify-center
                                      text-[8px] font-black
                                      ${
                                        status ===
                                        'AVAILABLE'
                                          ? 'bg-white/5 border border-white/5 text-white/20'
                                          : ''
                                      }
                                      ${
                                        status ===
                                        'LOCKED'
                                          ? 'bg-yellow-500/20 border border-yellow-400/40 text-yellow-200'
                                          : ''
                                      }
                                      ${
                                        status ===
                                        'SOLD'
                                          ? 'text-white'
                                          : ''
                                      }
                                    `}
                                    style={{
                                      backgroundColor:
                                        status ===
                                        'SOLD'
                                          ? zone.colorHex
                                          : undefined,
                                    }}
                                  >
                                    {col}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-8 p-6 bg-pure-black rounded-3xl shadow-sm border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-white/5 border border-white/10 shadow-sm" />

              <span className="text-[10px] font-black text-white/20 tracking-[0.2em] uppercase">
                Còn trống
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-yellow-500/20 border border-yellow-400/40 shadow-sm" />

              <span className="text-[10px] font-black text-white/20 tracking-[0.2em] uppercase">
                Đang giữ
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-ticketbox-green shadow-sm" />

              <span className="text-[10px] font-black text-white/20 tracking-[0.2em] uppercase">
                Đã bán
              </span>
            </div>
          </div>
        </div>

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
                    {event.venue}
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
                      ? new Date(
                          event.startTime
                        ).toLocaleDateString(
                          'vi-VN'
                        )
                      : '(Chưa có thời gian)'}
                  </p>

                  <p className="text-[10px] font-black text-white/30 mt-1 uppercase tracking-wider">
                    {event.startTime
                      ? new Date(
                          event.startTime
                        ).toLocaleTimeString(
                          'vi-VN'
                        )
                      : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

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

              <span className="text-2xl font-black">
                %
              </span>
            </div>

            <div className="w-full bg-black/10 rounded-full h-3 mb-8 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${fillRate}%`,
                }}
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