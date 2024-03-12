import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StyledFirebaseAuth from "@/components/ui/styled-firebase-auth";
import AppConstants from "@/constants/app.constants";
import FirebaseConstants from "@/constants/firebase.constants";
import { auth, firebaseAuth } from "@/constants/firebase";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate({ to: "/jobs" });
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center md:min-h-screen">
      <div className="relative grid h-full min-w-[100vw] flex-col items-start justify-center lg:container md:min-h-screen md:items-center lg:max-w-none  lg:grid-cols-2 lg:px-0">
        <HeroSection />
        <div className="mt-4 md:mt-0 lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h2 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h2>
              <hr />
              <h3 className="text-xl font-semibold tracking-tight">
                Or Sign In
              </h3>
            </div>
            <div className="mx-4 grid gap-4 md:mx-0">
              <StyledFirebaseAuth
                uiConfig={FirebaseConstants.UI_CONFIG}
                firebaseAuth={firebaseAuth}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const HeroSection = () => {
  return (
    <div className="relative min-w-[100vw] flex-col bg-muted p-10 text-white dark:border-r md:h-full lg:flex lg:min-w-full">
      <div className="absolute inset-0 bg-zinc-900"></div>
      <img
        src="/background.jpg"
        className="absolute inset-0 hidden h-full object-cover lg:block"
        alt="Job tracker"
      />
      <div className="relative z-20 flex items-center gap-2 text-xl font-medium">
        <img src="/icon.png" alt="logo" className="h-12 w-12" />
        <h1 className="text-white lg:text-black">{AppConstants.AppTitle}</h1>
      </div>
      <div className="relative z-20 mt-auto">
        <Card className="hidden  backdrop-blur-sm lg:block lg:border-white lg:bg-white/50 lg:text-black">
          <CardHeader>
            <CardTitle>Track your jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p>An easier way to manage your job applications</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
