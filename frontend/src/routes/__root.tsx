import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { LoadingDialog } from "@/components/ui/loading-dialog";
import { auth } from "@/constants/firebase";
import { cn } from "@/lib/utils";
import {
  createRootRoute,
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { PlusSquare } from "lucide-react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";

const Root = () => {
  const router = useRouterState();
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const [signOut] = useSignOut(auth);

  const onSignOut = () => {
    signOut();
    navigate({ to: "/" });
  };

  if (loading) {
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
            <nav className="fixed z-10 flex w-full flex-row justify-between gap-2 border-b bg-white p-2 lg:px-8">
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
                    to={
                      router.location.pathname === "/jobs"
                        ? "/jobs/add/modal"
                        : "/jobs/add"
                    }
                    className="[&.active]:font-bold"
                  >
                    <PlusSquare className="mr-0 h-6 w-6 md:mr-2 md:h-4 md:w-4" />
                    <p className="hidden md:block">New Job</p>
                  </Link>
                </Button>
                <UserAvatar user={user} loading={loading} signOut={onSignOut} />
              </div>
            </nav>
          </>
        )}

        <div
          className={cn(
            "mx-auto min-h-screen px-2 pt-16 md:px-8 md:pt-20",
            user ? "container" : "",
          )}
        >
          <Outlet />
        </div>
      </main>
    </>
  );
};

export const Route = createRootRoute({
  component: Root,
});
