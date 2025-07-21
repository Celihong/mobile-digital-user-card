"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { cardRequest } from "@/lib/api/card-api";
import { useMutation } from "@tanstack/react-query";
import { CreateCardType } from "@/types/card-type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
  nationality: z.string().min(1),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  bio: z.string().min(1),
  web_site: z.string().min(1),
  job: z.string().min(1),
  address: z.string().min(1),
  company: z.string().min(1),
  phone: z.string().min(1),
  card_type: z.enum(["Modern", "Minimal", "Corporate"]),
  social: z.array(
    z.object({
      id: z.string().optional(),
      platform: z.string().min(1),
      icon: z.string().optional(),
      url: z.string().url(),
    })
  ),
});

type ProfileFormType = z.infer<typeof formSchema>;

// const DEFAULT_ICON =
//   "https://cdns-icons-png.flaticon.com/512/15047/15047435.png";

export default function ProfileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { CREATE_CARD } = cardRequest();

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "male",
      nationality: "Cambodian",
      dob: "",
      address: "",
      phone: "",
      card_type: "Minimal",
      web_site: "",
      bio: "",
      company: "",
      job: "",
      social: [{ platform: "", icon: "", url: "" }],
    },
  });

  const { control, handleSubmit } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "social",
  });

  // const [avatarFile, setAvatarFile] = useState<File | null>(null);
  // const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [socialIcons, setSocialIcons] = useState<Record<number, File | null>>(
    {}
  );
  const [iconPreviews, setIconPreviews] = useState<Record<number, string>>({});

  const isValidImage = (file: File) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const maxSize = 2 * 1024 * 1024;
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  };

  const createCardMutation = useMutation({
    mutationKey: ["crate_card"],
    mutationFn: (payload: CreateCardType) => CREATE_CARD(payload),
    onSuccess: () => {
      form.reset();
      // setAvatarFile(null);
      // setAvatarPreview(null);
      setSocialIcons({});
      setIconPreviews({});
      router.push("/");
    },
  });

  const onSubmit = async (values: ProfileFormType) => {
    setIsSubmitting(true);
    // let avatarUrl = avatarPreview;

    // Upload new avatar only if new file is selected
    // if (avatarFile) {
    //   const formData = new FormData();
    //   formData.append("image", avatarFile);
    //   const res = await fetch(
    //     "http://localhost:8000/api/v1/upload/upload-image",
    //     {
    //       method: "POST",
    //       body: formData,
    //     }
    //   );
    //   const data = await res.json();
    //   avatarUrl = data.url;
    // }

    // Upload new icons only if new files selected
    const updatedSocial = await Promise.all(
      values.social.map(async (item, index) => {
        const file = socialIcons[index];
        if (file) {
          const formData = new FormData();
          formData.append("image", file);
          const res = await fetch(
            "http://localhost:8000/api/v1/upload/upload-image",
            {
              method: "POST",
              body: formData,
            }
          );
          const data = await res.json();
          return { ...item, icon: data.url };
        }

        // 🧠 Keep existing icon preview if no new file
        return {
          ...item,
          icon: iconPreviews[index] || "",
        };
      })
    );

    const finalPayload = {
      ...values,
      // avatar: avatarUrl,
      social: updatedSocial,
    };
    createCardMutation.mutate(finalPayload);

    console.log("Final Payload:", finalPayload);
  };

 return (
  <div className="min-h-screen bg-gray-50 py-10 px-4">
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-xl space-y-6">
      <h1 className="text-2xl font-bold text-center">Create Digital Card</h1>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* ========== Section: Personal Info ========== */}
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="E.g. Cambodian" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="+85512345678" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Street, City" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ========== Section: Job Info ========== */}
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={control}
              name="job"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Developer, Designer..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Company name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="web_site"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="bio"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Short description about yourself" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ========== Section: Card Style ========== */}
          <div>
            <FormField
              control={control}
              name="card_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Style</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose card style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Modern">Modern</SelectItem>
                      <SelectItem value="Minimal">Minimal</SelectItem>
                      <SelectItem value="Corporate">Corporate</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ========== Section: Social Links ========== */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold border-b pb-2">Social Media</h2>
            {fields.map((fieldItem, index) => (
              <div key={fieldItem.id} className="p-4 bg-gray-100 rounded-xl relative">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 hover:bg-red-50"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </Button>

                <div className="flex items-center space-x-4 mb-4">
                  <label htmlFor={`icon-upload-${index}`}>
                    <div className="w-12 h-12 border rounded-md bg-white overflow-hidden">
                      <Avatar>
                        <AvatarImage
                          src={iconPreviews[index] || "https://github.com/evilrabbit.png"}
                          alt="Social Icon"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                    </div>
                  </label>
                  <Input
                    id={`icon-upload-${index}`}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && isValidImage(file)) {
                        setSocialIcons((prev) => ({ ...prev, [index]: file }));
                        setIconPreviews((prev) => ({
                          ...prev,
                          [index]: URL.createObjectURL(file),
                        }));
                      } else {
                        alert("Only images under 2MB are allowed");
                      }
                    }}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={control}
                    name={`social.${index}.platform` as const}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Facebook, Instagram..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`social.${index}.url` as const}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => append({ platform: "", icon: "", url: "" })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Social Link
            </Button>
          </div>

          {/* ========== Submit Button ========== */}
          <Button
            type="submit"
            className="w-full text-white bg-primary hover:bg-primary/90"
            disabled={isSubmitting || createCardMutation.isPending}
          >
            {isSubmitting || createCardMutation.isPending ? "Creating..." : "Create Card"}
          </Button>
        </form>
      </Form>
    </div>
  </div>
);
}
