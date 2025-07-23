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
    // <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
    <div className="max-w-sm mx-auto space-y-4">
      {/* Classic Card */}

      <div key={idx}>
        <Card className="bg-white border-4 border-amber-600 shadow-xl relative">
          <CardContent className="p-8">
            {/* Formal Header */}
            <div className="text-center border-b-2 border-amber-600 pb-6 mb-6">
              <div className="w-20 h-20 mx-auto mb-4 border-4 border-amber-600 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage src={me?.avatar} alt={me?.user_name} />
                  <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {me?.user_name}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h1 className="text-2xl font-bold text-amber-900 mb-2 font-serif tracking-wide">
                {me.full_name}
              </h1>
              <div className="bg-amber-600 text-white px-4 py-1 rounded-full inline-block">
                <span className="text-sm font-medium">{card.job}</span>
              </div>
              <p className="text-amber-700 font-medium mt-2 font-serif">
                {card.company}
              </p>
            </div>

            {/* Bio Section */}
            <div className="text-center mb-6">
              <p className="text-amber-800 text-sm leading-relaxed font-serif italic">
                {card.bio}
              </p>
            </div>

            {/* Contact Information - Formal List */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-900">
                    Telephone
                  </span>
                </div>
                <span className="text-sm text-amber-800 font-mono">
                  {card.phone}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-900">
                    Electronic Mail
                  </span>
                </div>
                <span className="text-sm text-amber-800 break-all">
                  {me?.email}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-900">
                    Website
                  </span>
                </div>
                <span className="text-sm text-amber-800">{card.web_site}</span>
              </div>
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-900">
                    Address
                  </span>
                </div>
                <span className="text-sm text-amber-800">{card.address}</span>
              </div>
            </div>

            {/* Formal Actions */}
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
                  // link.download = `${me?.full_name.replace(
                  //   " ",
                  //   "_"
                  // )}_${idx + 1}.vcf`;
                  link.download = `${(me?.full_name ?? "Unnamed_User").replace(
                    " ",
                    "_"
                  )}_${idx + 1}.vcf`;

                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                }}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-serif"
              >
                <Download className="w-4 h-4 mr-2" />
                Add to Address Book
              </Button>
              <div>
                {card.socialLinks.map((res, idx: number) => {
                  return (
                    <div className="" key={idx}>
                      <Button
                        variant="outline"
                        className="w-full border-amber-600 text-amber-700 hover:bg-amber-50 font-serif bg-transparent"
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
        </Card>
      </div>
    </div>
    // </div>
  );
};

export default MinimalCardServerSide;
