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
        <div key={idx} className="group transition-transform hover:scale-105 duration-500 ease-in-out">
          <div className="bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 border border-indigo-500 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-0">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                <div className="relative z-10 text-center">
                  <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-lg">
                    <AvatarImage src={me?.avatar} alt={me?.user_name} />
                    <AvatarFallback className="text-2xl font-semibold bg-indigo-500 text-white">
                      {me?.user_name}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-bold text-white mt-2">
                    {me?.full_name}
                  </h1>
                  <p className="text-indigo-200 font-medium">{card.job}</p>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-5 text-white">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                  <span className="text-sm font-semibold text-indigo-200">
                    {card.company || "N/A"}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-gray-300 italic">
                  {card.bio || "No bio provided."}
                </p>

                {/* Contact Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-indigo-300">
                      <Phone className="w-4 h-4" /> Phone
                    </div>
                    <p className="text-sm font-mono text-white">{card.phone}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-indigo-300 group hover:animate-bounce">
                      <Mail className="w-4 h-4" /> Email
                    </div>
                    <p className="text-sm font-mono text-white break-all">
                      {me?.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-indigo-300">
                      <Globe className="w-4 h-4" /> Website
                    </div>
                    <p className="text-sm text-white">{card.web_site}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-indigo-300">
                      <MapPin className="w-4 h-4" /> Location
                    </div>
                    <p className="text-sm text-white">{card.address}</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-4 space-y-3">
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
                      link.download = `${(
                        me?.full_name ?? "Unnamed_User"
                      ).replace(" ", "_")}_${idx + 1}.vcf`;

                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition duration-300"
                  >
                    <Download className="w-4 h-4 mr-2" /> Save Contact
                  </Button>

                  {card.socialLinks.map((res, idx: number) => (
                    <div key={idx} className="">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex gap-2 border-indigo-500 text-purple hover:bg-indigo-700/20 transition duration-300 w-full items-center"
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={res.icon} alt={res.platform} />
                          <AvatarFallback className="text-sm bg-gradient-to-br from-pink-500 to-fuchsia-600 text-white">
                             {res.platform[0]}
                          </AvatarFallback>
                        </Avatar>
                        {res.platform}
                      </Button>
                    </div>
                  ))}
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
