import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import Layout from "../layout/Layout";

import SignIn from "../pages/SignIn/SignIn";
import Home from "../pages/Home/Home";
import Popular from "../pages/Popular/Popular";
import Search from "../pages/Search/Search";
import Wishlist from "../pages/Wishlist/Wishlist";

export default function AppRouter()
{
    return (
        <BrowserRouter>
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
            </Routes>
        </BrowserRouter>
    );
}
