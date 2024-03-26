import { createFileRoute } from "@tanstack/react-router";
import useMessage from "../hooks/use-message.hook";
import { LoginForm, LoginFormValues } from "@application-tracker/frontend";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { callAsync: signInAsync, error: signInError } = useMessage(
    { type: "signInWithCred" },
    { enabled: false }
  );
  const { callAsync: signUpAsync, error: signUpError } = useMessage(
    { type: "signUpWithCred" },
    { enabled: false }
  );
  const [loginError] = useState<string | null>(
    signInError?.message || signUpError?.message || null
  );
  const [loggingIn, setLoggingIn] = useState(false);

  const onLoginSubmit = async (values: LoginFormValues) => {
    setLoggingIn(true);

    if (values.signUpMode) {
      await signUpAsync({
        type: "signUpWithCred",
        payload: { email: values.email, password: values.password },
      });
    } else {
      await signInAsync({
        type: "signInWithCred",
        payload: { email: values.email, password: values.password },
      });
    }

    setLoggingIn(false);
  };

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <div className="m-8 flex flex-row items-center justify-center gap-4 text-center text-lg font-bold">
        <img src="/icon.png" alt="logo" className="h-12 w-12" />
        <h1 className="text-black">Job Down - Job Application Tracker</h1>
      </div>
      <div className="flex w-full items-center justify-center p-4">
        <LoginForm
          onSubmit={onLoginSubmit}
          loginError={loginError}
          loading={loggingIn}
        />
      </div>
    </div>
  );
}
