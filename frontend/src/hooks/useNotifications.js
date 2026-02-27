import { useEffect, useRef, useState, useCallback } from "react";
import { useHelper } from "./useHelper";
import { BASE_URL } from "../api/api";

export function useNotifications() {
  const { token } = useHelper();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);  // ← missing in your version
  const isMounted = useRef(true);       // ← missing in your version

  const connect = useCallback(() => {
    if (!token || !isMounted.current) return;

    // Don't reconnect if already open or connecting
    if (wsRef.current && wsRef.current.readyState <= WebSocket.OPEN) return;

    const ws = new WebSocket(
      `ws://localhost:8000/ws/notifications/?token=${token}`
    );
    wsRef.current = ws;

    ws.onmessage = (event) => {
      if (!isMounted.current) return;
      const data = JSON.parse(event.data);

      if (data.type === "initial_notifications") {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n) => !n.is_read).length);
      }

      if (data.type === "new_notification") {
        setNotifications((prev) => [data.notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    };

    ws.onclose = (event) => {
      if (!isMounted.current) return;
      if (event.code !== 1000) {
        reconnectTimer.current = setTimeout(connect, 3000);
      }
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [token]);

  useEffect(() => {
    isMounted.current = true;

    if (document.readyState === "complete") {
      connect();
    } else {
      window.addEventListener("load", connect, { once: true });
    }

    return () => {
      isMounted.current = false;
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close(1000, "Component unmounted");
    };
  }, [connect]);

  const markRead = useCallback((id) => {
    wsRef.current?.send(JSON.stringify({ type: "mark_read", id }));
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllRead = useCallback(async () => {
    await fetch(`${BASE_URL}/api/mark-all-read/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }, [token]);

  return { notifications, unreadCount, markRead, markAllRead };
}