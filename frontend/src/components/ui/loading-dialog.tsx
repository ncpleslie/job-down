import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";
import { DialogHeader, DialogOverlay, DialogTitle } from "./dialog";
import LoadingSpinner from "./loading-spinner";

const Dialog = DialogPrimitive.Root;

const DialogPortal = DialogPrimitive.Portal;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
      <div className="flex w-full items-center justify-center space-x-2">
        <LoadingSpinner />
      </div>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

type LoadingDialogProps = {
  isLoading: boolean;
};

const LoadingDialog: React.FC<React.PropsWithChildren<LoadingDialogProps>> = ({
  isLoading,
  children,
}) => {
  return (
    <Dialog open={isLoading}>
      <DialogContent className="w-48">
        <DialogHeader>
          <DialogTitle className="text-center">{children}</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export { LoadingDialog };
