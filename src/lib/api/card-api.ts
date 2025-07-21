import request from "@/lib/api/request";
import { CreateCardType, ICardResponse } from "@/types/card-type";

export const cardRequest = () => {
  const GET_CARD = async (id: string): Promise<ICardResponse> => {
    return await request({
      url: `/card/get-card/${id}`,
      method: "GET",
    });
  };

  const CREATE_CARD = async (payload: CreateCardType) => {
    return await request({
      url: "/card/create-card",
      method: "POST",
      data: payload,
    });
  };
  const UPDATE_CARD = async (
    id: string,
    payload: CreateCardType
  ): Promise<ICardResponse> => {
    return await request({
      url: `/card/update-card/${id}`,
      method: "PUT",
      data: payload,
    });
  };
  return {
    UPDATE_CARD,
    GET_CARD,
    CREATE_CARD,
  };
};
