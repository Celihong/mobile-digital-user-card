import axios from "@/lib/api/request";

export const userRequest = () => {
  const createCard = async (cardData: any) => {
    return await axios({
      url: "/card/create-card",
      method: "POST",
      data: cardData,
    });
  };

  return {
    createCard,
  };
};
