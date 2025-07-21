"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userRequest } from "@/lib/api/user-api";
import { authRequest } from "@/lib/api/auth-api";
import { useForm } from "react-hook-form";
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

import { IUser, UserData } from "@/types/user-type";

export default function Home() {
  const { PROFILE, updatedProfile } = userRequest();
  const { AUTH_LOGOUT } = authRequest();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [avatarUrlInput, setAvatarUrlInput] = useState<string>("");
  const [avatarEditOpen, setAvatarEditOpen] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState("");

  const { data: me, isLoading } = useQuery<IUser>({
    queryKey: ["profile"],
    queryFn: PROFILE,
  });

  type ProfileFormData = Pick<UserData, "full_name" | "user_name" | "email">;

  const { register, handleSubmit, reset } = useForm<ProfileFormData>({
    defaultValues: {
      full_name: "",
      user_name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (me?.data) {
      reset({
        full_name: me.data.full_name || "",
        user_name: me.data.user_name || "",
        email: me.data.email || "",
      });
      setAvatarUrlInput(me.data.avatar || "");
      setTempAvatarUrl(me.data.avatar || "");
    }
  }, [me, reset]);

  useEffect(() => {
    setTempAvatarUrl(avatarUrlInput);
  }, [avatarUrlInput]);

  const mutation = useMutation({
    mutationFn: async (data: Partial<IUser>) => {
      return await updatedProfile(data);
    },
    onSuccess: () => {
      setEditMode(false);
      setAvatarEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      if (me?.data) {
        reset({
          full_name: me.data.full_name || "",
          user_name: me.data.user_name || "",
          email: me.data.email || "",
        });
        setAvatarUrlInput(me.data.avatar || "");
      }
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    mutation.mutate({
      ...data,
      avatar: avatarUrlInput,
    });
  };

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
          <img
            src="https://i.imgur.com/MHWLac7.gif"
            className="h-32 w-full object-cover"
            alt="Banner"
          />
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
                editMode ? "hover:ring-4 hover:ring-blue-400" : ""
              }`}
              onClick={() => {
                if (editMode) setAvatarEditOpen(true);
              }}
              title={editMode ? "Click to edit avatar" : undefined}
            >
              <AvatarImage
                src={avatarUrlInput || me?.data?.avatar}
                alt="@user"
              />
              <AvatarFallback>{me?.data?.full_name}</AvatarFallback>
            </Avatar>

            {editMode && (
              <div
                className="absolute bottom-1 ml-15 bg-blue-600 rounded-full p-1 hover:bg-blue-700 transition-colors"
                onClick={() => setAvatarEditOpen(true)}
                title="Edit Avatar"
              >
                <Pencil className="w-4 h-4 text-white" />
              </div>
            )}

            {avatarEditOpen && (
              <div className="absolute top-28 left-1/2 -translate-x-1/2 bg-white p-4 rounded shadow-lg z-50 w-80 max-w-full">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Paste new Avatar URL
                </label>
                <input
                  type="text"
                  value={tempAvatarUrl}
                  onChange={(e) => setTempAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
                <div className="flex justify-end gap-2 mt-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTempAvatarUrl(avatarUrlInput);
                      setAvatarEditOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setAvatarUrlInput(tempAvatarUrl.trim());
                      setAvatarEditOpen(false);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center space-y-2">
            {editMode ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <input
                  type="text"
                  {...register("full_name")}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border rounded text-center"
                  required
                />
                <input
                  type="text"
                  {...register("user_name")}
                  placeholder="Username"
                  className="w-full px-3 py-2 border rounded text-center"
                  required
                />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Email"
                  className="w-full px-3 py-2 border rounded text-center"
                  required
                />
                <div className="flex justify-center gap-2 pt-2">
                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditMode(false);
                      reset();
                      setAvatarUrlInput(me?.data?.avatar || "");
                      setAvatarEditOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <>
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
              </>
            )}
          </div>

          {!editMode && (
            <div className="mt-4 flex flex-col-12 sm:flex-row justify-center flex-wrap gap-3 sm:gap-4 text-sm">
              <Button
                variant="outline"
                className="gap-2 w-full sm:w-auto justify-center"
                onClick={() => setEditMode(true)}
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
          )}
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
    </div>
  );
}
