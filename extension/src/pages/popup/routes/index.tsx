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
  const { callAsync: signInAnonAsync, error: signInAnonError } = useMessage(
    { type: "signInAnonymous" },
    { enabled: false }
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

  const onGuestLogin = async () => {
    setLoggingIn(true);
    await signInAnonAsync({ type: "signInAnonymous" });
    setLoggingIn(false);
  };

  return (
    <div className="flex flex-col justify-center items-center py-4 px-2">
      <div className="mb-2 flex flex-row items-center justify-between gap-4 text-center text-lg font-bold">
        <img src="/icon.png" alt="logo" className="h-8 w-8" />
        <h1 className="text-black">Job Down - Job Application Tracker</h1>
      </div>
      <div className="flex w-full items-center justify-center">
        <LoginForm
          onSubmit={onLoginSubmit}
          onGuestLogin={onGuestLogin}
          loginError={
            signInError || signUpError || signInAnonError ? "Error" : null
          }
          loading={loggingIn}
        />
      </div>
    </div>
  );
}
