import PublicCardServerSide from "@/components/name-card-serverside/public-card-serverside";
// import { _envCons } from "@/constants";
import { CardResponse } from "@/types/card-type";

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;

  const data = await fetch(
    `http://localhost:8000/api/v1/card/get-card-username/${username}`
  );
  if (!data.ok) {
    // Handle HTTP errors
    throw new Error(`Failed to fetch cards: ${data.status}`);
  }

  const cards: CardResponse = await data.json();

  return (
    <div className="min-h-screen  bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-4 flex items-center justify-center">
        <PublicCardServerSide cards={cards} />
      </div>
    </div>
  );
};

export default Page;
