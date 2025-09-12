export interface Role {
  id: number | string;
  name: string;
}

export interface Status {
  id: number | string;
  name: string;
}

export interface Address {
  id: string | number;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  id: number | string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  provider: string;
  socialId: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
  status: Status;
  addresses: Address[];
}

export interface CreateUser {
  email: string;
  fullName: string;
  password: string;
  role: number;
}

export interface UpdateUser {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role: number;
  status: number;
}
