import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { config } from "../config/envConfig";
import { SocketEvent } from "../shared/enum";
import { getUserId } from "../redux/authSlice";
import { useSelector } from "react-redux";

type EventCallback = (data: any) => void;
const { socketURL } = config.server;

const useSocket = (handlers: Partial<Record<SocketEvent, EventCallback>>) => {
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef(handlers);

  const userId = useSelector(getUserId);
  const [isConnected, setIsConnected] = useState(false);

  // Cập nhật handler mỗi khi thay đổi
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  // Khởi tạo kết nối socket chỉ 1 lần
  useEffect(() => {
    const socket = io(socketURL, {
      transports: ["websocket"],
      query: { userId },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket.IO connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket.IO disconnected");
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [socketURL, userId]);

  // Đăng ký và huỷ listener mỗi khi handlers thay đổi
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const entries = Object.entries(handlers) as [SocketEvent, EventCallback][];

    for (const [eventName, handler] of entries) {
      socket.on(eventName, handler);
    }

    return () => {
      for (const [eventName, handler] of entries) {
        socket.off(eventName, handler);
      }
    };
  }, [handlers]);

  const sendMessage = (
    event: SocketEvent,
    data: any,
    callback?: (response: any) => void
  ) => {
    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit(event, data, (response: any) => {
        callback?.(response);
      });
    } else {
      console.warn("⚠️ Socket chưa kết nối. Không thể gửi dữ liệu.");
    }
  };

  return { sendMessage, isConnected };
};

export default useSocket;
