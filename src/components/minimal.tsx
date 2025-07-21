import React from "react";
import {
  Download,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
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
      <Card className="rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-[#0b9651] via-[#1d0101] to-[#4c1d95] text-white border border-purple-900">
        <CardContent className="p-6">
          {/* Edit Button */}
          <Link href={`/update-card/${card.id}`} className="block text-right mb-2">
            <Button size="sm" variant="ghost" className="text-gray-600 hover:bg-gray-100">
              Edit
            </Button>
          </Link>

          {/* Avatar & Name */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16 border border-gray-300">
              <AvatarImage src={me?.data?.avatar} alt={me?.data?.user_name} />
              <AvatarFallback className="bg-gray-300 text-gray-700 text-lg">
                {me?.data?.user_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{me?.data.full_name}</h2>
              <p className="text-sm text-gray-500">{card.job}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                {card.company}
              </span>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-4 text-sm text-gray-600">{card.bio}</p>

          {/* Contact Info */}
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{card.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{me?.data?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <Link
                href={card.web_site}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {card.web_site}
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{card.address}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <Button
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg"
              onClick={async () => {
                // VCard download logic
                // ...
              }}
            >
              <Download className="w-4 h-4 mr-2" /> Save Contact
            </Button>

            <div className="flex justify-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-400 text-gray-600 hover:bg-gray-100 font-semibold"
              >
                <Linkedin className="w-4 h-4 mr-1" /> LinkedIn
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-400 text-gray-600 hover:bg-gray-100 font-semibold"
              >
                <Github className="w-4 h-4 mr-1" /> GitHub
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MinimalCard;
