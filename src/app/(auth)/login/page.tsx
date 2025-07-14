"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { authRequest } from "@/lib/api/auth-api";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthLoginType } from "@/types/auth-type";

const LoginSchema = z.object({
  user_name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

export default function Login() {
  const { AUTH_LOGIN } = authRequest();
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      user_name: "",
      password: "",
    },
  });

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["login"],
    mutationFn: (payload: AuthLoginType) => AUTH_LOGIN(payload),
    onSuccess: (data) => {
      console.log("✅ Login Success:", data);
      // router.push("/card");
    },
    onError: (error: any) => {
      console.error("❌ Login Error:", error.message);
    },
  });

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    console.log("Form submitted:", data);
    mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-6">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-5 shadow-2xl sm:rounded-xl sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              className="mx-auto h-10 w-auto"
              src="https://www.svgrepo.com/show/301692/login.svg"
              alt="Workflow"
            />
            <h2 className="mt-9 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 mt-8"
            >
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
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
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Signing in..." : "Sign in"}
              </Button>

              {error && (
                <p className="text-sm text-red-500 text-center mt-2">
                  {error.message}
                </p>
              )}

              <p className="text-center text-sm text-gray-500 mt-6">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/auth/register"
                  className="font-semibold text-blue-500 hover:underline"
                >
                  Register
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
