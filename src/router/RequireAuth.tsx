import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }: { children: React.ReactNode })
{
    const raw = localStorage.getItem("auth");
    const auth = raw ? JSON.parse(raw) : null;
    if (!auth?.loggedIn) return <Navigate to="/signin" replace />;
    return <>{children}</>;
}