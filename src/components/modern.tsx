import React from "react";
import {
  Download,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { IUser } from "@/types/user-type";
import { CardItem } from "@/types/card-type";

const Modern = ({
  me,
  card,
  idx,
}: {
  me: IUser;
  card: CardItem;
  idx: number;
}) => {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 animate-fade-in">
      <Card className="rounded-3xl bg-gradient-to-tr from-cyan-600 via-blue-700 to-indigo-800 text-white shadow-lg border border-cyan-700">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden">
              <Avatar className="w-full h-full">
                <AvatarImage src={me?.data?.avatar} alt={me?.data?.user_name} />
                <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-600 text-white text-3xl font-bold">
                  {me?.data?.user_name?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-3xl font-extrabold tracking-wide">{me?.data.full_name}</h1>
            <p className="px-6 py-1 bg-cyan-700 rounded-full text-sm font-semibold tracking-wide">
              {card.job}
            </p>
            <p className="mt-4 text-center text-cyan-200 text-sm leading-relaxed">{card.bio}</p>

            <div className="grid grid-cols-2 gap-4 w-full mt-6 text-sm">
              <div className="flex items-center gap-2 bg-cyan-700 rounded-lg p-3">
                <Phone className="w-5 h-5 text-white" />
                <span>{card.phone}</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-700 rounded-lg p-3">
                <Mail className="w-5 h-5 text-white" />
                <span>{me?.data?.email}</span>
              </div>
              <div className="flex items-center gap-2 bg-indigo-700 rounded-lg p-3">
                <Globe className="w-5 h-5 text-white" />
                <a href={card.web_site} target="_blank" rel="noopener noreferrer" className="truncate underline hover:text-cyan-300">
                  {card.web_site}
                </a>
              </div>
              <div className="flex items-center gap-2 bg-purple-700 rounded-lg p-3">
                <MapPin className="w-5 h-5 text-white" />
                <span className="truncate">{card.address}</span>
              </div>
            </div>

            <Button
              onClick={async () => {
                const toBase64 = async (url: string) => {
                  const response = await fetch(url);
                  const blob = await response.blob();
                  return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      resolve(reader.result?.toString().split(",")[1] || "");
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                  });
                };

                const avatarBase64 = me?.data.avatar
                  ? await toBase64(me?.data.avatar)
                  : "";

                const vcard = [
                  "BEGIN:VCARD",
                  "VERSION:3.0",
                  `FN:${me?.data.full_name}`,
                  `N:${me?.data.full_name};;;;`,
                  `ORG:${card.company}`,
                  `TITLE:${card.job}`,
                  `TEL;TYPE=WORK,VOICE:${card.phone}`,
                  `EMAIL;TYPE=PREF,INTERNET:${me?.data.email}`,
                  avatarBase64 ? `PHOTO;ENCODING=b;TYPE=JPEG:${avatarBase64}` : "",
                  `URL:${card.web_site}`,
                  `ADR;TYPE=WORK:;;${card.address};;;;`,
                  `NOTE:${card.bio}`,
                  "END:VCARD",
                ]
                  .filter(Boolean)
                  .join("\r\n");

                const blob = new Blob([vcard], {
                  type: "text/vcard;charset=utf-8",
                });

                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${(
                  me?.data.full_name ?? "Unnamed_User"
                ).replace(" ", "_")}_${idx + 1}.vcf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              }}
              className="mt-8 w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 font-semibold rounded-xl py-3 transition-transform hover:scale-105"
            >
              <Download className="w-5 h-5 mr-2 inline-block" /> Save Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Modern;
