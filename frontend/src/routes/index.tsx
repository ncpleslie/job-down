import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppConstants from "@/constants/app.constants";
import { auth } from "@/constants/firebase";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import LoginForm from "@/components/LoginForm";
import { LoginFormValues } from "@/constants/login-form.constants";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    if (user) {
      navigate({ to: "/jobs" });
    }
  }, [user, navigate]);

  const onLoginSubmit = async (values: LoginFormValues) => {
    setLoggingIn(true);
    if (values.signUpMode) {
      try {
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password,
        );
      } catch (error) {
        setLoginError((error as Error)?.message);
      }
    } else {
      try {
        signInWithEmailAndPassword(auth, values.email, values.password);
      } catch (error) {
        setLoginError((error as Error)?.message);
      }
    }

    setLoggingIn(false);
  };

  if (user) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center md:min-h-screen">
      <div className="relative grid h-full min-w-[100vw] flex-col items-start justify-center lg:container md:min-h-screen md:items-center lg:max-w-none  lg:grid-cols-2 lg:px-0">
        <HeroSection />
        <div className="flex w-full items-center justify-center">
          <LoginForm
            onSubmit={onLoginSubmit}
            loginError={loginError}
            loading={loggingIn}
          />
        </div>
      </div>
    </div>
  );
}

const HeroSection = () => {
  return (
    <div className="relative min-w-[100vw] flex-col bg-muted p-10 text-white dark:border-r md:h-full lg:flex lg:min-w-full">
      <div className="absolute inset-0 bg-zinc-900"></div>
      <img
        src="/background.jpg"
        className="absolute inset-0 hidden h-full object-cover lg:block"
        alt="Job tracker"
      />
      <div className="relative z-20 flex items-center gap-2 text-xl font-medium">
        <img src="/icon.png" alt="logo" className="h-12 w-12" />
        <h1 className="text-white lg:text-black">{AppConstants.AppTitle}</h1>
      </div>
      <div className="relative z-20 mt-auto">
        <Card className="hidden backdrop-blur-lg lg:block lg:bg-white/50 lg:text-black">
          <CardHeader>
            <CardTitle>Track your jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p>An easier way to manage your job applications</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
