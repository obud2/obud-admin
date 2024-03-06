import axiosInstance from '@/constants/axiosInstance';
import { API_URL } from '@/constants/config';
import { Pass, UserPass } from '@/entities/pass';
import { Place } from '@/entities/place';
import { Program } from '@/entities/program';

type ListPassesRequest = {
  placeId: Place['id'];
  // cf. status=ACTIVE인 경우 is_show=true인 pass만 조회
  status?: string;
};

type ListPassesResponse = {
  value: Pass[];
};

const listPasses = async (req: ListPassesRequest) => {
  const searchParams = new URLSearchParams();

  if (req.placeId) searchParams.set('placeId', req.placeId);
  if (req.status) searchParams.set('status', req.status);

  const response = await axiosInstance.get<ListPassesResponse>(`${API_URL}/pass`, {
    params: searchParams,
  });

  return response.data;
};

export type CreatePassRequest = {
  isShow: boolean;
  placeId: Place['id'];
  title: string;
  durationInDays: number;
  price: number;
  maxReservations: number | null;
  maxCancels: number | null;
  minCancelWindowHour: number;
  minCancelWindowMinute: number;
  notice: string;
  refundPolicy: string;
};

const createPass = async (req: CreatePassRequest) => {
  await axiosInstance.post(`${API_URL}/pass`, req);
};

type ListUserPassesRequest = {
  placeId: Place['id'];
  query?: string;
  status?: 'IN_USE' | 'EXPIRED' | 'CANCELLED';
};

type ListUserPassesResponse = {
  value: UserPass[];
};

const listUserPasses = async (req: ListUserPassesRequest) => {
  const searchParams = new URLSearchParams();

  if (req.placeId) searchParams.set('placeId', req.placeId);
  if (req.query) searchParams.set('query', req.query);
  if (req.status) searchParams.set('status', req.status);

  const response = await axiosInstance.get<ListUserPassesResponse>(`${API_URL}/pass/users`, {
    params: searchParams,
  });

  return response.data;
};

type CreateUserPassRequest = {
  passId: Pass['id'];
  userId: string;
  startDate: string;
};

const createUserPass = async (req: CreateUserPassRequest) => {
  await axiosInstance.post(`${API_URL}/pass/users`, req);
};

type UpdateUserPassRequest = {
  userPassId: UserPass['id'];
  startDate: string;
  endDate: string;
};

const updateUserPass = async (req: UpdateUserPassRequest) => {
  await axiosInstance.put(`${API_URL}/pass/users/${req.userPassId}`, req);
};

type CancelUserPassRequest = {
  userPassId: UserPass['id'];
};

const cancelUserPass = async (req: CancelUserPassRequest) => {
  await axiosInstance.post(`${API_URL}/pass/users/${req.userPassId}/cancel`);
};

type CreatePassForProgramRequest = {
  programId: Program['id'];
  passIds: Pass['id'][];
};

const createPassForProgram = async (req: CreatePassForProgramRequest) => {
  await axiosInstance.post(`${API_URL}/pass/programs/${req.programId}`, req);
};

export const PassService = {
  listPasses,
  createPass,
  listUserPasses,
  createUserPass,
  updateUserPass,
  cancelUserPass,
  createPassForProgram,
};
