import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useMessage from "../hooks/use-message.hook";
import {
  Button,
  LoginForm,
  LoginFormValues,
} from "@application-tracker/frontend";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data: signInResult, callAsync: signInAsync } = useMessage(
    { type: "signInWithCred" },
    { enabled: false }
  );
  const { data: signUpResult, callAsync: signUpAsync } = useMessage(
    { type: "signUpWithCred" },
    { enabled: false }
  );
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
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
