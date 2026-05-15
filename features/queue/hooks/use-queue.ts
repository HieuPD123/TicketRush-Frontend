"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { joinQueue } from "@/features/queue/services/join_queue";
import { sendHeartBeat } from "@/features/queue/services/heartbeat_queue";
import { leaveQueue } from "@/features/queue/services/leave_queue";
import { websocketService } from "@/features/websocket/services/websocket-services";

export type QueueStatus = "WAITING" | "GRANTED" | "EXPIRED" | "IDLE";

export type QueueState = {
  status: QueueStatus;
  position: number;
  totalInQueue: number;
  estimatedWaitSeconds: number;
  isLoading: boolean;
  error: string | null;
};

const HEARTBEAT_INTERVAL_MS = 30_000;

export function useQueue(eventId: number) {
  const [state, setState] = useState<QueueState>({
    status: "IDLE",
    position: 0,
    totalInQueue: 0,
    estimatedWaitSeconds: 0,
    isLoading: false,
    error: null,
  });

  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  const startHeartbeat = useCallback(() => {
    stopHeartbeat();
    heartbeatRef.current = setInterval(() => {
      void sendHeartBeat(eventId);
    }, HEARTBEAT_INTERVAL_MS);
  }, [eventId, stopHeartbeat]);

  const handleSocketMessage = useCallback((raw: string) => {
    try {
      const msg = JSON.parse(raw) as {
        eventId: number;
        status: QueueStatus;
        position: number;
        totalInQueue: number;
        estimatedWaitSeconds: number;
      };

      setState((prev) => ({
        ...prev,
        status: msg.status,
        position: msg.position,
        totalInQueue: msg.totalInQueue,
        estimatedWaitSeconds: msg.estimatedWaitSeconds,
      }));

      if (msg.status === "GRANTED" || msg.status === "EXPIRED") {
        stopHeartbeat();
      }
    } catch {
      // ignore malformed messages
    }
  }, [stopHeartbeat]);

  const joinQueueFlow = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await joinQueue(eventId);

    if (!result.ok) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: result.message,
      }));
      return;
    }

    // Seed initial state from join response (idempotent: returns existing position if already in queue)
    setState((prev) => ({
      ...prev,
      isLoading: false,
      status: "WAITING",
      position: result.status?.position ?? 0,
      totalInQueue: result.status?.totalInQueue ?? 0,
      estimatedWaitSeconds: 0,
    }));

    // Connect WebSocket & subscribe
    websocketService.connect();
    unsubscribeRef.current = websocketService.subscribe(
      `/user/queue/queue/${eventId}`,
      handleSocketMessage,
    );

    // Start heartbeat
    startHeartbeat();
  }, [eventId, handleSocketMessage, startHeartbeat]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopHeartbeat();
      unsubscribeRef.current?.();
    };
  }, [stopHeartbeat]);

  const leaveQueueFlow = useCallback(async (): Promise<{ ok: boolean; message: string }> => {
    stopHeartbeat();
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;

    const result = await leaveQueue(eventId);

    setState((prev) => ({
      ...prev,
      status: "IDLE",
      position: 0,
      totalInQueue: 0,
      estimatedWaitSeconds: 0,
      error: null,
    }));

    return { ok: result.code === 200, message: result.message };
  }, [eventId, stopHeartbeat]);

  const isGranted = state.status === "GRANTED";
  const isWaiting = state.status === "WAITING";
  const isExpired = state.status === "EXPIRED";

  return {
    state,
    isGranted,
    isWaiting,
    isExpired,
    joinQueueFlow,
    leaveQueueFlow,
  };
}
