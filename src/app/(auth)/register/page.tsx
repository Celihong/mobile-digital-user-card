"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { authRequest } from "@/lib/api/auth-api";
import { useDeviceStore } from "@/store/device-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthRegisterType } from "@/types/auth-type";

const RegisterSchema = z.object({

  user_name: z.string().min(2, { message: "Username is required" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Minimum 6 characters" }),
  full_name: z.string().min(1, { message: "Full name is required" }),
});

export default function Register() {
  const router = useRouter();
  const { device, fetchDeviceInfo } = useDeviceStore();
  const { AUTH_REGISTER } = authRequest();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      full_name: "",
      user_name: "",
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: (payload: AuthRegisterType) => AUTH_REGISTER(payload),
    onSuccess: () => {
      console.log("✅ Registration Success");
      router.push("/page");
    },
    onError: (error: any) => {
      console.error("❌ Registration Error:", error.message);
    },
  });

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    console.log("Form submitted:", data);
    mutate({
      ...data,
      os: device?.os,
      ip_address: device?.ip_address ?? undefined,
      browser: device?.browser,
      device_type: device?.device_type,
      device_name: device?.device_name,
    });
  };

  useEffect(() => {
    fetchDeviceInfo();
  }, [fetchDeviceInfo]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 shadow-md rounded">
        <div className="text-center">
          <img
            src="https://www.svgrepo.com/show/301692/login.svg"
            alt="Logo"
            className="mx-auto h-12 w-12"
          />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Create an Account
          </h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-5"
          >
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ful Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="john123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 text-white hover:bg-blue-500 py-2 rounded"
            >
              {isPending ? "Creating..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login
              </a>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
