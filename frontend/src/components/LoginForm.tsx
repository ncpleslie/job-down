import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formSchema, LoginFormValues } from "@/constants/login-form.constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import RequiredText from "@/components/ui/required-text";
import { useEffect, useState } from "react";

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  loginError: string | null;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loginError,
  loading,
}) => {
  const [signUpMode, setSignUpMode] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      signUpMode: signUpMode,
    },
    disabled: loading,
  });

  useEffect(() => {
    form.setValue("signUpMode", signUpMode);
  }, [signUpMode]);

  return (
    <div className="flex grow flex-col gap-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="flex w-full flex-row items-center justify-center gap-4 p-2">
            <Button
              type="button"
              onClick={() => setSignUpMode(false)}
              className="w-full"
              variant={signUpMode ? "outline" : "default"}
            >
              Sign In
            </Button>
            <Button
              type="button"
              onClick={() => setSignUpMode(true)}
              className="w-full"
              variant={signUpMode ? "default" : "outline"}
            >
              Sign Up
            </Button>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex w-full justify-center text-center md:w-[34ch]">
                {signUpMode
                  ? "Create a new account"
                  : "Continue with an existing account"}
              </CardTitle>
              {loginError && (
                <CardDescription className="rounded border border-red-200 bg-red-100 p-4 text-center text-black">
                  Something went wrong. Please re-enter your account details and
                  try again.
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <RequiredText>*</RequiredText>
                    </FormLabel>

                    <FormControl>
                      <Input type="email" {...field} />
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
                    <FormLabel>
                      Password <RequiredText>*</RequiredText>
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex w-full justify-center">
              <Button
                className="w-full"
                variant={loading ? "ghost" : "default"}
                disabled={loading}
                type="submit"
              >
                Continue
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
