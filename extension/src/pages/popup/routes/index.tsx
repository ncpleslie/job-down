import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useMessage from "../hooks/use-message.hook";
import { Button } from "@application-tracker/frontend";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data: signInResult, callAsync: signInAsync } = useMessage("login");
  const navigate = useNavigate();

  const signIn = async () => {
    await signInAsync("login");
    if (signInResult) {
      navigate({ to: "/jobs", replace: true });
    }
  };

  return (
    <div>
      <h1>Index</h1>
      <Button onClick={signIn}>Sign in</Button>
    </div>
  );
}
