"use client";

import { useRouter } from "next/navigation";
import React, { useState, use, useEffect } from "react";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { cardRequest } from "@/lib/api/card-api";
import { CreateCardType, SocialLink } from "@/types/card-type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
  nationality: z.string().min(1),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  address: z.string().min(1),
  phone: z.string().min(1),
  bio: z.string().min(1),
  web_site: z.string(),
  job: z.string(),
  company: z.string(),
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

export default function ProfileForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const { GET_CARD, UPDATE_CARD } = cardRequest();
  const {
    data: cardData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["card"],
    queryFn: async () => GET_CARD(id),
    enabled: !!id,
  });

  const updateCardMutation = useMutation({
    mutationKey: ["update_card"],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: CreateCardType;
    }) => UPDATE_CARD(id, payload),
    onSuccess: () => {
      router.push("/");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "male",
      nationality: "CAMBODIAN",
      dob: "",
      address: "",
      phone: "",
      card_type: "Minimal",
      bio: "",
      job: "",
      web_site: "",
      company: "",
      social: [{ platform: "", icon: "", url: "" }],
    },
  });

  const { control, handleSubmit, register } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "social",
  });

  const [socialIcons, setSocialIcons] = useState<Record<number, File | null>>({});
  const [iconPreviews, setIconPreviews] = useState<Record<number, string>>({});

  const isValidImage = (file: File) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const maxSize = 2 * 1024 * 1024;
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  };

  useEffect(() => {
    if (cardData) {
      form.reset({
        gender: cardData?.card.gender,
        job: cardData?.card.job,
        web_site: cardData?.card?.web_site,
        bio: cardData?.card?.bio,
        nationality: cardData?.card.nationality || "USA",
        dob: cardData?.card.dob || "",
        address: cardData?.card.address || "",
        phone: cardData?.card.phone || "",
        card_type: cardData?.card.card_type || "Minimal",
        company: cardData?.card?.company,
        social:
          cardData?.card.socialLinks?.length > 0
            ? cardData?.card.socialLinks.map((item: SocialLink) => ({
                id: item.id,
                platform: item.platform,
                icon: item.icon,
                url: item.url,
              }))
            : [{ platform: "", icon: "", url: "" }],
      });

      const previews: Record<number, string> = {};
      cardData?.card.socialLinks?.forEach((item: SocialLink, index: number) => {
        if (item.icon) previews[index] = item.icon;
      });
      setIconPreviews(previews);
    }
  }, [cardData, form]);

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (isError) return <div className="text-center text-red-500 mt-10">Error loading profile.</div>;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const updatedSocial = await Promise.all(
      values.social.map(async (item, index) => {
        const file = socialIcons[index];
        if (file) {
          const formData = new FormData();
          formData.append("image", file);
          const res = await fetch("http://localhost:8000/api/v1/upload/upload-image", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          return { ...item, icon: data.url };
        }
        return {
          ...item,
          icon: iconPreviews[index] || "",
        };
      })
    );

    const finalPayload = {
      ...values,
      social: updatedSocial,
    };

    updateCardMutation.mutate({ id, payload: finalPayload });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Update Profile</h1>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 bg-gray-50 shadow-lg p-8 rounded-xl border"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField control={control} name="gender" render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
              )} />

              <FormField control={control} name="dob" render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input placeholder="YYYY-MM-DD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={control} name="nationality" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <FormControl>
                    <Input placeholder="Nationality" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={control} name="job" render={({ field }) => (
                <FormItem>
                  <FormLabel>Job</FormLabel>
                  <FormControl>
                    <Input placeholder="Job title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={control} name="company" render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Company" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={control} name="web_site" render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={control} name="bio" render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input placeholder="Short bio..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={control} name="card_type" render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Card Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose style" />
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
              )} />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Social Media Links</h3>
              {fields.map((fieldItem, index) => (
                <div key={fieldItem.id} className="p-4 bg-white border rounded-lg relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input {...register(`social.${index}.platform`)} placeholder="Platform" />
                    <Input {...register(`social.${index}.url`)} placeholder="https://..." />
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && isValidImage(file)) {
                          const newIcons = { ...socialIcons, [index]: file };
                          setSocialIcons(newIcons);
                          const previewUrl = URL.createObjectURL(file);
                          setIconPreviews((prev) => ({ ...prev, [index]: previewUrl }));
                        }
                      }}
                    />
                  </div>
                  {iconPreviews[index] && (
                    <div className="mt-2">
                      <Avatar>
                        <AvatarImage src={iconPreviews[index]} />
                        <AvatarFallback>Icon</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ platform: "", icon: "", url: "" })}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Social Link
              </Button>
            </div>

            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
              Save Changes
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
