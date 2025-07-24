import React from "react";
import {
  Badge,
  Download,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { User, ICard } from "@/types/card-type";

const CorporateCardService = ({
  me,
  card,
  idx,
}: {
  me: User;
  card: ICard;
  idx: number;
}) => {
  return (
    <div className="relative max-w-sm mx-auto p-6 animate-slide-fade">
      <Card className="rounded-[30px] overflow-hidden shadow-2xl border border-purple-800 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] text-white backdrop-blur-md">
        <CardContent className="relative p-6 z-10">
          {/* Avatar */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative hover:scale-105 transition-transform">
              <div className="bg-gradient-to-br from-pink-500 via-yellow-400 to-purple-500 rounded-full p-1 shadow-lg">
                <Avatar className="w-24 h-24 border-4 border-white shadow-inner">
                  <AvatarImage src={me?.avatar} alt={me?.user_name} />
                  <AvatarFallback className="bg-purple-800 text-white text-2xl font-bold">
                    {me?.user_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
            </div>

            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-400 bg-clip-text text-transparent tracking-tight drop-shadow-md">
              {me?.full_name}
            </h1>
            <div className="text-[11px] tracking-wider uppercase font-semibold bg-white/10 px-4 py-1 rounded-full backdrop-blur-md shadow-sm border border-white/20">
              {card.job}
            </div>
          </div>

          {/* Company Badge */}
          <div className="text-center mt-4">
            <Badge className="bg-gradient-to-r from-indigo-400 to-cyan-400 border-0 px-4 py-1 text-white rounded-full shadow">
              {card.company}
            </Badge>
          </div>

          {/* Bio */}
          <p className="mt-4 text-center text-sm text-white/90 bg-white/5 rounded-xl px-4 py-3 leading-relaxed border border-white/10 shadow-inner">
            {card.bio}
          </p>

          {/* Contact Info */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <ContactBlock icon={<Phone className="w-4 h-4 text-yellow-300" />} value={card.phone} />
            <ContactBlock
              icon={
                <div className="group relative">
                  <Mail className="w-4 h-4 text-cyan-300 group-hover:animate-float transition-transform duration-300" />
                </div>
              }
              value={me?.email}
            />
            <ContactBlock icon={<Globe className="w-4 h-4 text-green-300" />} value={card.web_site} isLink />
            <ContactBlock icon={<MapPin className="w-4 h-4 text-orange-300" />} value={card.address} />
          </div>

          {/* Action Buttons */}
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

                const avatarBase64 = me?.avatar ? await toBase64(me.avatar) : "";

                const vcard = [
                  "BEGIN:VCARD",
                  "VERSION:3.0",
                  `FN:${me?.full_name}`,
                  `N:${me?.full_name};;;;`,
                  `ORG:${card.company}`,
                  `TITLE:${card.job}`,
                  `TEL;TYPE=WORK,VOICE:${card.phone}`,
                  `EMAIL;TYPE=PREF,INTERNET:${me?.email}`,
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
                link.download = `${(me?.full_name ?? "Unnamed_User").replace(" ", "_")}_${idx + 1}.vcf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              }}
              className="w-full bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-400 hover:brightness-110 text-black font-semibold rounded-xl transition-transform hover:scale-105"
            >
              <Download className="w-5 h-5 mr-2 inline-block" /> Save Contact
            </Button>

            {/* Social Links */}
            <div className="grid grid-cols-2 gap-3">
              {card.socialLinks?.map((res, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="flex items-center space-x-2 justify-center border border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-md transition-all shadow-sm rounded-lg"
                >
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={res.icon} alt={res.platform} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-bold">
                      {res.platform[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{res.platform}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ContactBlock = ({
  icon,
  value,
  isLink = false,
}: {
  icon: React.ReactNode;
  value: string;
  isLink?: boolean;
}) => {
  return (
    <div className="bg-white/5 p-3 rounded-lg flex items-center space-x-2 border border-white/10 group transition-transform hover:scale-105">
      {icon}
      {isLink ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-blue-300 underline hover:text-blue-400 text-sm"
        >
          {value}
        </a>
      ) : (
        <span className="truncate text-sm text-white/90">{value}</span>
      )}
    </div>
  );
};

export default CorporateCardService;
