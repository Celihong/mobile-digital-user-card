import axios from "@/lib/api/request";
import { IUser } from "@/types/user-type";

export const userRequest = () => {
  const PROFILE = async (): Promise<IUser> => {
    return await axios({
      url: "/user/me",
      method: "GET",
    });
  };
  const updatedProfile = async (payload: Partial<IUser>): Promise<IUser> => {
    return await axios({
      url: "/user/update-profile",
      method: "PUT",
      data: payload,
    });
  };

  return {
    PROFILE,
    updatedProfile,  };
};
