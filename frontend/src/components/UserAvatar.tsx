import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/constants/firebase";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import LoadingSpinner from "./ui/loading-spinner";

const UserAvatar = () => {
  const [user, loading] = useAuthState(auth);
  const [signOut] = useSignOut(auth);

  const initials = user?.displayName
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  if (loading) {
    return (
      <div className="flex h-[40px] w-[40px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.photoURL || ""} />
          <AvatarFallback>{initials || "AT"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
