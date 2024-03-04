import { PropsWithChildren } from "react";

const RequiredText: React.FC<PropsWithChildren> = ({ children }) => {
  return <span className="text-red-500">{children}</span>;
};

export default RequiredText;
