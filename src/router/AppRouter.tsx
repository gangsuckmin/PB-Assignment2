import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import Layout from "../layout/Layout";

import SignIn from "../pages/SignIn/SignIn";
import Home from "../pages/Home/Home";
import Popular from "../pages/Popular/Popular";
import Search from "../pages/Search/Search";
import Wishlist from "../pages/Wishlist/Wishlist";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/signin" element={<SignIn />} />

            <Route
                element={
                    <RequireAuth>
                        <Layout />
                    </RequireAuth>
                }
            >
                <Route path="/" element={<Home />} />
                <Route path="/popular" element={<Popular />} />
                <Route path="/search" element={<Search />} />
                <Route path="/wishlist" element={<Wishlist />} />
            </Route>

            {/* ✅ 매칭 실패 시 홈으로 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
