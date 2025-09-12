import { DiscountEventEnum, EventStatusEnum } from "../shared/enum";

export interface DiscountEvent {
  id: string;
  name: string;
  type: DiscountEventEnum;
  status: EventStatusEnum;
  pid: string | null;
  discount: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UpdateEvent {
  name: string;
  status: EventStatusEnum;
  type: DiscountEventEnum;
  pid?: string;
  discount: number;
  startTime: string;
  endTime: string;
}

export interface CreateEvent {
  name: string;
  status: EventStatusEnum;
  type: DiscountEventEnum;
  pid?: string;
  discount: number;
  startTime: string;
  endTime: string;
}
