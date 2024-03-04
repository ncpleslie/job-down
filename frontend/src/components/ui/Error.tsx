import { PropsWithChildren } from "react";

const Error: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <span className="rounded-md border-2 border-red-200 bg-red-100 p-2 text-center">
      {children}
    </span>
  );
};

export default Error;
