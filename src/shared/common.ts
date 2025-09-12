import { jwtDecode } from "jwt-decode";
import { Pagination } from "../interfaces/app.interface";
import dayjs from "dayjs";

interface DecodedToken {
  sessionId: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

export function getSessionIdFromToken(): string | null {
  const token = localStorage.getItem("authToken");

  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.sessionId || null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

export const parsePaginationHeaders = (
  headers: Record<string, string>
): Pagination => {
  return {
    currentPage: Number(headers["x-page"] || 1),
    totalPages: Number(headers["x-pages-count"] || 1),
    perPage: Number(headers["x-per-page"] || 10),
    totalItems: Number(headers["x-total-count"] || 0),
  };
};

export const formatDateToVietnamese = (date: string | Date): string => {
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const capitalizeFirstLetter = (text: string): string => {
  return text
    .toLowerCase()
    .split(/[_\s]+/) // tách theo dấu _ hoặc khoảng trắng
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Hàm kiểm tra ngày nhỏ hơn hôm nay thì disable
export const disabledPastDate = (current: dayjs.Dayjs) => {
  return current && current < dayjs().startOf("day");
};
