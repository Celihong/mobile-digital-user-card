import { Download, Globe, Mail, MapPin, Phone } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { ICard, User } from "@/types/card-type";

const ModernCardServerSide = ({
  me,
  card,
  idx,
}: {
  me: User;
  card: ICard;
  idx: number;
}) => {
  return (
    <div className="mt-10 w-full max-w-md mx-auto p-4">
      <div className="grid grid-cols-1 gap-6">
        <div key={idx}>
          <div className="bg-slate-800 border-slate-700 shadow-2xl rounded-2xl">
            <CardContent className="p-0">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 relative overflow-hidden rounded-t-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                <div className="relative z-10">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src={me?.avatar} alt={me?.user_name} />
                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {me?.user_name}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {me?.full_name}
                  </h1>
                  <p className="text-cyan-100 font-medium">{card.job}</p>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-cyan-400 text-sm font-medium">
                    {card.company || "N/A"}
                  </span>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {card.bio || "No bio provided."}
                </p>

                {/* Contact Grid */}
                <div className="grid grid-cols-2 gap-3 py-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-cyan-400" />
                      <span className="text-xs text-slate-400">Phone</span>
                    </div>
                    <p className="text-sm text-white font-mono">{card.phone}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-cyan-400" />
                      <span className="text-xs text-slate-400">Email</span>
                    </div>
                    <p className="text-sm text-white break-all">{me?.email}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3 text-cyan-400" />
                      <span className="text-xs text-slate-400">Website</span>
                    </div>
                    <p className="text-sm text-white">{card.web_site}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      <span className="text-xs text-slate-400">Location</span>
                    </div>
                    <p className="text-sm text-white">{card.address}</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={async () => {
                      const toBase64 = async (url: string) => {
                        const response = await fetch(url);
                        const blob = await response.blob();
                        return new Promise<string>((resolve, reject) => {
                          const reader = new FileReader();
                          reader.onloadend = () =>
                            resolve(
                              reader.result?.toString().split(",")[1] || ""
                            );
                          reader.onerror = reject;
                          reader.readAsDataURL(blob);
                        });
                      };

                      const avatarBase64 = me?.avatar
                        ? await toBase64(me?.avatar)
                        : "";

                      const vcard = [
                        "BEGIN:VCARD",
                        "VERSION:3.0",
                        `FN:${me?.full_name}`,
                        `N:${me?.full_name};;;;`,
                        `ORG:${card.company}`,
                        `TITLE:${card.job}`,
                        `TEL;TYPE=WORK,VOICE:${card.phone}`,
                        `EMAIL;TYPE=PREF,INTERNET:${me?.email}`,
                        avatarBase64
                          ? `PHOTO;ENCODING=b;TYPE=JPEG:${avatarBase64}`
                          : "",
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
                      // link.download = `${me?.data.full_name.replace(
                      //   " ",
                      //   "_"
                      // )}_${idx + 1}.vcf`;
                      link.download = `${(
                        me?.full_name ?? "Unnamed_User"
                      ).replace(" ", "_")}_${idx + 1}.vcf`;

                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    }}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Save Contact
                  </Button>
                  {card.socialLinks.map((res, idx: number) => {
                    return (
                      <div className="" key={idx}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent w-full"
                        >
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={res.icon} alt={res.platform} />
                            <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {res.platform}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernCardServerSide;
