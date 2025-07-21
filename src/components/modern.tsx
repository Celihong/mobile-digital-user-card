import React from "react";
import {
  Download,
  Linkedin,
  Github,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CardItem } from "@/types/card-type";
import { IUser } from "@/types/user-type";

const MinimalCard = ({
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
      <Card className="rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-[#5c5b59] via-[#9c2222] to-[#4c1d95] text-white border border-purple-900">
        <CardContent className="p-6 text-gray-900">
          <Link href={`/update-card/${card.id}`} className="block mb-4 text-right">
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-500 hover:text-gray-900"
            >
              Edit
            </Button>
          </Link>

          <div className="flex flex-col items-center space-y-3">
            <Avatar className="w-20 h-20 rounded-full border border-gray-300">
              <AvatarImage src={me?.data?.avatar} alt={me?.data?.user_name} />
              <AvatarFallback>{me?.data?.user_name?.[0]}</AvatarFallback>
            </Avatar>

            <h2 className="text-lg font-medium">{me?.data.full_name}</h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest">{card.job}</p>
            <p className="text-xs font-semibold text-gray-700 mt-1 truncate max-w-full text-center">
              {card.company}
            </p>

            <p className="mt-3 text-center text-gray-600 text-sm leading-relaxed">
              {card.bio}
            </p>

            <div className="mt-6 space-y-3 w-full text-gray-700 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>{card.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span>{me?.data?.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-gray-400" />
                <Link
                  href={card.web_site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate underline text-gray-600 hover:text-gray-800"
                >
                  {card.web_site}
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
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
              className="w-full mt-6 bg-gray-900 text-white rounded-lg py-3 font-semibold hover:bg-gray-800 transition"
            >
              <Download className="w-5 h-5 mr-2 inline-block" /> Save Contact
            </Button>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <Linkedin className="w-5 h-5 mr-1 inline-block" /> LinkedIn
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
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

export default MinimalCard;
