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
    <div className="flex justify-center items-center p-4">
      <LoginForm
        onSubmit={onLoginSubmit}
        loginError={loginError}
        loading={loggingIn}
      />
    </div>
  );
}
