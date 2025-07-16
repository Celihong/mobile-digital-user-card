import { CardItem } from "./card-type";

export interface IUser {
  message: string;
  data: UserData;
  avatar?: string;
}
export interface UserData {
  id: string;
  full_name?: string | undefined;
  user_name: string;
  email: string;
  password: string;
  avatar?: string;
  is_deleted: boolean;
  is_active: boolean;
  roles: string[];
  created_at: string;
  updated_at: string;
  idCard: CardItem[];
}
