import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      {/* Support both patterns: nested routes via <Outlet /> or explicit children */}
      {children ?? <Outlet />}
    </>
  );
}