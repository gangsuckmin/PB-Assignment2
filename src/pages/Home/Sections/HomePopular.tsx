import { useEffect, useMemo, useState } from "react";
import "./HomePopular.css";
import MovieGrid from "../../../components/Views/MovieGrid";
import MovieInfiniteScroll from "../../../components/Views/MovieInfiniteScroll";
import { urls } from "../../../api/urls";

export default function HomePopular() {
    const apiKey = localStorage.getItem("TMDb-Key") || "";
    const [currentView, setCurrentView] = useState<"grid" | "list">("grid");

    useEffect(() => {
        document.body.style.overflow = "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const fetchUrl = useMemo(() => {
        return urls.popular(apiKey, 1);
    }, [apiKey]);

    return (
        <div className={`popular-container ${currentView}`}>
            {/* 🔘 View Toggle */}
            <div className="view-toggle">
                <button
                    type="button"
                    onClick={() => setCurrentView("grid")}
                    className={`toggle-btn grid-btn ${
                        currentView === "grid" ? "active" : ""
                    }`}
                >
                    ▦
                </button>

                <button
                    type="button"
                    onClick={() => setCurrentView("list")}
                    className={`toggle-btn list-btn ${
                        currentView === "list" ? "active" : ""
                    }`}
                >
                    ☰
                </button>
            </div>

            {/* ❌ title 제거 */}
            {currentView === "grid" && <MovieGrid fetchUrl={fetchUrl} />}

            {currentView === "list" && (
                <MovieInfiniteScroll
                    apiKey={apiKey}
                    genreCode={"28"}
                    sortingOrder={"all"}
                    voteEverage={-1}
                />
            )}
        </div>
    );
}