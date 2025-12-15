import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./RequireAuth";
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
                <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
                <Route path="/popular" element={<RequireAuth><Popular /></RequireAuth>} />
                <Route path="/search" element={<RequireAuth><Search /></RequireAuth>} />
                <Route path="/wishlist" element={<RequireAuth><Wishlist /></RequireAuth>} />
            </Routes>
        </BrowserRouter>
    );
}