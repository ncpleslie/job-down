import {
  createRootRoute,
  Link,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import useMessage from "../hooks/use-message.hook";
import {
  Button,
  LoadingDialog,
  UserAvatar,
} from "@application-tracker/frontend";
import { useEffect } from "react";
import { PlusSquare } from "lucide-react";
import { env } from "@src/env";
import { useVisible } from "../hooks/use-visible.hook";

export const Route = createRootRoute({
  component: () => {
    const visibilityChange = useVisible();
    const { callAsync: getTokenAsync } = useMessage({
      type: "userToken",
    });
    const { data: user, isPending, error } = useMessage({ type: "user" });
    const { callAsync: signOutAsync } = useMessage(
      { type: "signOut" },
      {
        enabled: false,
      }
    );
    const navigate = useNavigate();

    const onSignOut = async () => {
      await signOutAsync({ type: "signOut" });
    };

    const openWebApp = () => {
      window.open(env.VITE_WEB_URL, "_blank");
    };

    useEffect(() => {
      if (user) {
        navigate({ to: "/jobs" });
      }

      if (!user) {
        navigate({ to: "/" });
      }
    }, [user]);

    // Grab a new user token when the visibility changes to
    // avoid having a stale token each time the popup is opened.
    useEffect(() => {
      if (visibilityChange) {
        getTokenAsync({ type: "userToken" });
      }
    }, [visibilityChange]);

    if (isPending) {
      return <LoadingDialog isLoading={true}>Authenticating</LoadingDialog>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    return (
      <>
        <main>
          {user && (
            <>
              <nav className="flex w-full flex-row justify-between gap-2 p-2">
                <div className="flex flex-row gap-2">
                  <Button
                    variant="link"
                    onClick={openWebApp}
                    className="px-0 py-0"
                  >
                    <img
                      src="/icon.png"
                      width={"40"}
                      height={"20"}
                      className="aspect-square"
                      alt="logo"
                    />
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/jobs" className="[&.active]:font-bold">
                      Jobs
                    </Link>
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    asChild
                    className="self-end justify-self-end"
                  >
                    <Link
                      to={"/jobs/add"}
                      className="[&.active]:font-bold [&.active]:underline [&.active]:border-2 [&.active]:ring-2 [&.active]:ring-primary/90 [&.active]:ring-offset-2"
                      title="Add a new job"
                    >
                      <PlusSquare className="h-6 w-6" />
                    </Link>
                  </Button>
                  <UserAvatar user={user} loading={false} signOut={onSignOut} />
                </div>
              </nav>
              <hr className="mb-2" />
            </>
          )}
          <Outlet />
        </main>
      </>
    );
  },
});
