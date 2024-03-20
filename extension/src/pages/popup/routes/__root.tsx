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
import AppConstants from "@src/constants/app.constants";
import { PlusSquare } from "lucide-react";

export const Route = createRootRoute({
  component: () => {
    const { data: user, isPending, error } = useMessage("user");
    const { data: signOutResult, callAsync: signOutAsync } = useMessage(
      "signOut",
      { enabled: false }
    );
    const navigate = useNavigate();

    const onSignOut = async () => {
      await signOutAsync("signOut");
      if (signOutResult) {
        navigate({ to: "/" });
      }
    };

    useEffect(() => {
      console.log(user);
      if (user) {
        navigate({ to: "/jobs" });
      }

      if (!user) {
        navigate({ to: "/" });
      }
    }, [user]);

    if (isPending) {
      return <LoadingDialog isLoading={true}>Authenticating</LoadingDialog>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    return (
      <>
        <main
          style={{ height: AppConstants.height, width: AppConstants.width }}
        >
          {user && (
            <>
              <nav className="flex w-full flex-row justify-between gap-2 p-2">
                <div className="flex flex-row gap-2">
                  <Link to="/jobs">
                    <img
                      src="/icon.png"
                      width={"40"}
                      height={"20"}
                      className="aspect-square"
                      alt="logo"
                    />
                  </Link>
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
