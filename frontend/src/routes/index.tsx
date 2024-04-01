import { auth } from "@/constants/firebase";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
} from "firebase/auth";
import LoginForm from "@/components/LoginForm";
import { LoginFormValues } from "@/constants/login-form.constants";
import useHead from "@/hooks/use-head.hook";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  useHead("Login");

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
        await signInWithEmailAndPassword(auth, values.email, values.password);
      } catch (error) {
        setLoginError((error as Error)?.message);
      }
    }

    setLoggingIn(false);
  };

  const onGuestLogin = async () => {
    setLoggingIn(true);
    try {
      signInAnonymously(auth);
    } catch (error) {
      setLoginError((error as Error)?.message);
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
    <div className="flex h-full w-full flex-col items-center">
      <div className="m-8 flex flex-row items-center justify-center gap-8 text-center text-2xl font-bold">
        <img src="/icon.png" alt="logo" className="h-24 w-24" />
        <h1 className="text-black">Job Down - Job Application Tracker</h1>
      </div>
      <div className="flex w-full items-center justify-center p-2 md:p-8 lg:w-[500px]">
        <LoginForm
          onSubmit={onLoginSubmit}
          onGuestLogin={onGuestLogin}
          loginError={loginError}
          loading={loggingIn}
        />
      </div>
    </div>
  );
}
