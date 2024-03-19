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

export const Route = createRootRoute({
  component: () => {
    const sendMessage = useMessage();
    const { data: user, isPending, error } = sendMessage("login");
    const navigate = useNavigate();

    // const onSignOut = () => {
    //   sendMessage("signOut");
    // };

    useEffect(() => {
      if (user) {
        navigate({ to: "/jobs" });
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
              <Link to={"/jobs/add"} className="[&.active]:font-bold">
                {/* <PlusSquare className="mr-2 h-4 w-4" /> */}
                New Job
              </Link>
            </Button>
            {/* <UserAvatar user={user} loading={false} signOut={onSignOut} /> */}
          </div>
        </nav>
        <hr className="mb-8" />
        <Outlet />
      </>
    );
  },
});
