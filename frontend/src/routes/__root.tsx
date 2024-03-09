import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { LoadingDialog } from "@/components/ui/loading-dialog";
import { auth } from "@/constants/firebase";
import {
  createRootRoute,
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { PlusSquare } from "lucide-react";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";

export const Route = createRootRoute({
  component: () => {
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
        <main className={`${user ? "container" : ""} mx-auto min-h-screen`}>
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
                      to={
                        router.location.pathname === "/jobs"
                          ? "/jobs/add/modal"
                          : "/jobs/add"
                      }
                      className="[&.active]:font-bold"
                    >
                      <PlusSquare className="mr-2 h-4 w-4" />
                      New Job
                    </Link>
                  </Button>
                  <UserAvatar
                    user={user}
                    loading={loading}
                    signOut={onSignOut}
                  />
                </div>
              </nav>
              <hr className="mb-8" />
            </>
          )}

          <Outlet />
        </main>
      </>
    );
  },
});
