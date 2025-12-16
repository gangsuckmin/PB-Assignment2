import { useEffect, useMemo, useState } from "react";
import "./HomePopular.css";
import MovieGrid from "../../../components/Views/MovieGrid";
import MovieInfiniteScroll from "../../../components/Views/MovieInfiniteScroll";
import { urls } from "../../../api/urls";

export default function HomePopular() {
    const apiKey = localStorage.getItem("TMDb-Key") || "";
    const [currentView, setCurrentView] = useState<"grid" | "list">("grid");

    useEffect(() => {
        document.body.style.overflow = currentView === "grid" ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [currentView]);

    const fetchUrl = useMemo(() => {
        return urls.popular(apiKey, 1);
    }, [apiKey]);

    return (
        <div className={`popular-container view-${currentView}`}>
            <div className="view-toggle">
                <button
                    onClick={() => setCurrentView("grid")}
                    className={currentView === "grid" ? "active" : ""}
                    aria-label="grid view"
                >
                    ⬛⬜
                </button>

                <button
                    onClick={() => setCurrentView("list")}
                    className={currentView === "list" ? "active" : ""}
                    aria-label="list view"
                >
                    ☰
                </button>
            </div>

            {currentView === "grid" && (
                <MovieGrid title="인기 영화" fetchUrl={fetchUrl} />
            )}

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