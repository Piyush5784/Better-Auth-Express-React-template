"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/custom/form";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { PasswordInput } from "@/components/custom/password-input";
import { Link } from "@tanstack/react-router";
import { useLogin } from "@/hooks/use-user";
import { loginFormSchema } from "@/lib/validation-schemas";
import { signIn } from "@/lib/auth-client";
import { FRONTEND_URL } from "@/config";

const formSchema = loginFormSchema;

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { mutate, isPending } = useLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function LoginWithGoogle() {
    await signIn.social({
      provider: "google",
      callbackURL: `${FRONTEND_URL}/dashboard`
    });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Google account or Credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <Button
                    variant="outline"
                    onClick={LoginWithGoogle}
                    type="button"
                    disabled={isPending}
                  >
                    <FcGoogle />
                    Login with Google
                  </Button>
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </Field>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Field>
                        <div className="flex items-center">
                          <FieldLabel htmlFor="password">Password</FieldLabel>
                          <Link
                            to="/"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <FormControl>
                          <PasswordInput
                            id="password"
                            placeholder="******"
                            autoComplete="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </Field>
                    </FormItem>
                  )}
                />
                <Field>
                  <Button
                    type="submit"
                    className="w-full"
                    // disabled={isLoading}
                  >
                    Login
                  </Button>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{" "}
                    <Link to="/auth/register" className="underline">
                      Sign up
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link to="/" className="underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/" className="underline">
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </div>
  );
}
