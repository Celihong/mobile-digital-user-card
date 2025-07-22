import React from "react";
import {
  Badge,
  Download,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CardItem } from "@/types/card-type";
import { IUser } from "@/types/user-type";

const Corporate = ({
  me,
  card,
  idx,
}: {
  me: IUser;
  card: CardItem;
  idx: number;
}) => {
  return (
    <div className="relative max-w-sm mx-auto p-6">
      <Card className="rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] text-white border border-purple-900">
        <CardContent className="relative p-6 z-10">
          <Link href={`/update-card/${card.id}`} className="absolute top-4 right-4">
            <Button
              size="sm"
              variant="outline"
              className="text-white bg-white/10 border-white/20 hover:bg-white/20"
            >
              Edit
            </Button>
          </Link>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative">
              <div className="bg-gradient-to-br from-pink-500 via-yellow-400 to-purple-500 rounded-full p-1">
                <Avatar className="w-24 h-24 border-4 border-white">
                  <AvatarImage src={me?.data?.avatar} alt={me?.data?.user_name} />
                  <AvatarFallback className="bg-purple-700 text-white text-xl">
                    {me?.data?.user_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-ping"></span>
            </div>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              {me?.data.full_name}
            </h1>
            <div className="text-xs bg-pink-600/30 px-3 py-1 rounded-full uppercase font-semibold tracking-wide">
              {card.job}
            </div>
          </div>

          <div className="text-center mt-4">
            <Badge className="bg-gradient-to-r from-indigo-400 to-cyan-400 border-0 px-4 py-1 text-white">
              {card.company}
            </Badge>
          </div>

          <p className="mt-4 text-center text-sm bg-white/10 rounded-lg p-3 leading-relaxed">
            {card.bio}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="bg-purple-900/20 p-3 rounded-lg flex items-center space-x-2">
              <Phone className="w-5 h-5 text-yellow-300" />
              <span>{card.phone}</span>
            </div>
            <div className="bg-pink-900/20 p-3 rounded-lg flex items-center space-x-2">
              <Mail className="w-5 h-5 text-cyan-300" />
              <span>{me?.data?.email}</span>
            </div>
            <div className="bg-blue-900/20 p-3 rounded-lg flex items-center space-x-2">
              <Globe className="w-5 h-5 text-green-300" />
              <Link
                href={card.web_site}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-blue-300 underline hover:text-blue-400"
              >
                {card.web_site}
              </Link>
            </div>
            <div className="bg-indigo-900/20 p-3 rounded-lg flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-orange-300" />
              <span className="truncate">{card.address}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
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
              className="w-full bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-400 hover:brightness-110 text-black font-semibold rounded-xl transition-transform hover:scale-105"
            >
              <Download className="w-5 h-5 mr-2 inline-block" /> Save Contact
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400/20 font-bold transition"
              >
                <Linkedin className="w-5 h-5 mr-1 inline-block" /> LinkedIn
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-2 border-purple-400 text-purple-300 hover:bg-purple-400/20 font-bold transition"
              >
                <Github className="w-5 h-5 mr-1 inline-block" /> GitHub
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Corporate;
