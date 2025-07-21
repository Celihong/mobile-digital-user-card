"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userRequest } from "@/lib/api/user-api";
import { authRequest } from "@/lib/api/auth-api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { User, Mail, Plus, Pencil, LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { CardItem } from "@/types/card-type";

import CorporateCard from "@/components/corporate-card";
import Modern from "@/components/modern";
import Minimal from "@/components/minimal";

import { IUser } from "@/types/user-type";

import CorporateCard from "@/components/profile-card/corporate-card";
import UpdateUserDialog from "@/components/profile-card/formedit";

export default function Home() {
  const { PROFILE } = userRequest();
  const { AUTH_LOGOUT } = authRequest();

  const router = useRouter();
  const queryClient = useQueryClient();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState<string>("");
  const [avatarEditOpen, setAvatarEditOpen] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState("");

  const { data: me, isLoading } = useQuery<IUser>({
    queryKey: ["me"],
    queryFn: PROFILE,
  });

  useEffect(() => {
    if (me?.data) {
      setAvatarUrlInput(me.data.avatar || "");
      setTempAvatarUrl(me.data.avatar || "");
    }
  }, [me]);

  useEffect(() => {
    setTempAvatarUrl(avatarUrlInput);
  }, [avatarUrlInput]);

  const handleLogout = async () => {
    try {
      await AUTH_LOGOUT();
    } catch (err) {
      console.error("Logout failed:", err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (isLoading) return "Loading...";

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-100 to-slate-200 py-8 px-4 sm:px-6">
      <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mb-8 relative">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-pink-500 relative rounded-t-2xl">
          <div className="absolute inset-0 bg-black/10 rounded-t-2xl" />

          <Button
            onClick={handleLogout}
            className="absolute top-4 right-4 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 hover:text-black transition"
          >
            <LogOut className="w-4 h-4 mr-1" />
          </Button>
        </div>

        <div className="relative px-6 pb-6">
          <div className="flex justify-center -mt-14 mb-4 relative">
            <Avatar
              className={`w-24 h-24 border-4 border-white shadow-md cursor-pointer ${
                editDialogOpen ? "hover:ring-4 hover:ring-blue-400" : ""
              }`}
              onClick={() => {
                if (editDialogOpen) setAvatarEditOpen(true);
              }}
              title={editDialogOpen ? "Click to edit avatar" : undefined}
            >
              <AvatarImage
                src={avatarUrlInput || me?.data?.avatar}
                alt="@user"
              />
              <AvatarFallback>{me?.data?.full_name}</AvatarFallback>
            </Avatar>

            {editDialogOpen && (
              <div
                className="absolute bottom-1 ml-15 bg-blue-600 rounded-full p-1 hover:bg-blue-700 transition-colors"
                onClick={() => setAvatarEditOpen(true)}
                title="Edit Avatar"
              >
                <Pencil className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 truncate">
              {me?.data?.full_name}
            </h1>
            <div className="flex justify-center items-center gap-1 text-gray-600 text-sm flex-wrap">
              <User className="w-4 h-4" />
              <span className="truncate">@{me?.data?.user_name}</span>
            </div>
            <div className="flex justify-center items-center gap-1 text-gray-600 text-sm flex-wrap">
              <Mail className="w-4 h-4" />
              <span className="break-all">{me?.data?.email}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col-12 sm:flex-row justify-center flex-wrap gap-3 sm:gap-4 text-sm">
            <Button
              variant="outline"
              className="gap-2 w-full sm:w-auto justify-center"
              onClick={() => setEditDialogOpen(true)}
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </Button>

            <Link href="/create-card">
              <Button className="gap-2 w-full bg-blue-700 sm:w-auto justify-center">
                <Plus className="w-4 h-4" />
                Create Card
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 🧩 Card Rendering Section */}
      <div className="w-full max-w-xl mx-auto space-y-6">
        {me?.data?.idCard?.length === 0 && (
          <div className="text-center text-gray-500">
            No cards found. Create one!
          </div>
        )}

        {me?.data?.idCard?.map((card: CardItem, idx: number) => (
          <div
            key={idx}
            className="hover:scale-[1.01] transition-all duration-300"
          >
            {card.card_type === "Corporate" && (
              <CorporateCard me={me} card={card} idx={idx} />
            )}

            {card.card_type === "Modern" && (
              <Modern me={me} card={card} idx={idx} />
            )}
            {card.card_type === "Minimal" && (
              <Minimal me={me} card={card} idx={idx} />
            )}

          </div>
        ))}
      </div>

      {me?.data && (
        <UpdateUserDialog
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
          user={me.data}
          onSave={() => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
          }}
        />
      )}
    </div>
  );
}
