import React from "react";
import { Button } from "../ui/button";
import { Download, Globe, Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ICard, User } from "@/types/card-type";

const MinimalCardServerSide = ({
  me,
  card,
  idx,
}: {
  me: User;
  card: ICard;
  idx: number;
}) => {
  return (
    <div className="max-w-sm mx-auto space-y-6 animate-fade-in">
      <div key={idx} className="hover:scale-[1.02] transition-transform duration-500 ease-in-out">
        <Card className="bg-gradient-to-br from-slate-800 to-slate-950 text-white border-0 shadow-2xl rounded-2xl">
          <CardContent className="p-8">
            <div className="text-center border-b border-slate-700 pb-6 mb-6">
              <div className="w-24 h-24 mx-auto mb-4 border-4 border-teal-400 rounded-full overflow-hidden">
                <Avatar className="w-full h-full">
                  <AvatarImage src={me?.avatar} alt={me?.user_name} />
                  <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                    {me?.user_name?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2 tracking-wider">
                {me.full_name}
              </h1>
              <div className="bg-teal-500 text-white px-4 py-1 rounded-full inline-block">
                <span className="text-sm font-medium">{card.job}</span>
              </div>
              <p className="text-teal-300 font-medium mt-2">{card.company}</p>
            </div>

            <div className="text-center mb-6">
              <p className="text-slate-300 text-sm leading-relaxed italic">
                {card.bio}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-teal-400" />
                  <span className="text-sm font-medium text-slate-100">
                    Telephone
                  </span>
                </div>
                <span className="text-sm text-slate-300 font-mono">{card.phone}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-2 group">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-teal-400 transition-transform group-hover:-translate-y-1 duration-300" />
                  <span className="text-sm font-medium text-slate-100">
                    Electronic Mail
                  </span>
                </div>
                <span className="text-sm text-slate-300 break-all">{me?.email}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-teal-400" />
                  <span className="text-sm font-medium text-slate-100">
                    Website
                  </span>
                </div>
                <span className="text-sm text-slate-300">{card.web_site}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-teal-400" />
                  <span className="text-sm font-medium text-slate-100">
                    Address
                  </span>
                </div>
                <span className="text-sm text-slate-300">{card.address}</span>
              </div>
            </div>

            <div className="space-y-3">
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

                  const avatarBase64 = me?.avatar ? await toBase64(me?.avatar) : "";

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
                  link.download = `${(me?.full_name ?? "Unnamed_User").replace(
                    " ",
                    "_"
                  )}_${idx + 1}.vcf`;

                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                }}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white transition-all duration-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Add to Address Book
              </Button>
              <div className="space-y-2">
                {card.socialLinks.map((res, idx: number) => {
                  return (
                    <div className="" key={idx}>
                      <Button
                        variant="outline"
                        className="w-full border border-teal-400 text-teal-300 hover:bg-slate-800 transition-colors duration-300 flex gap-2 items-center"
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={res.icon} alt={res.platform} />
                          <AvatarFallback className="text-sm bg-gradient-to-br from-pink-500 to-fuchsia-600 text-white">
                            {res.platform?.[0] ?? "S"}
                          </AvatarFallback>
                        </Avatar>
                        {res.platform}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MinimalCardServerSide;
