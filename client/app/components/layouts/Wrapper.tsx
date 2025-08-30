import type { ReactNode } from "react";

type WrapperProps = {
  children: ReactNode;
};

export default function Wrapper({ children }: WrapperProps) {
  return (
    <div className="w-full h-full flex justify-center items-center max-sm:justify-start">
      <div className="w-full max-w-[1400px] px-[20px] min-w-[375px]">
        <div className="min-w-0 w-full h-full">{children}</div>
      </div>
    </div>
  );
}
