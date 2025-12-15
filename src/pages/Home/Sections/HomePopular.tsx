import { useEffect, useMemo, useState } from "react";
import "./HomePopular.css";
import MovieGrid from "../../../components/Views/MovieGrid";
import MovieInfiniteScroll from "../../../components/Views/MovieInfiniteScroll";
import { urls } from "../../../api/urls";

// FontAwesome 완전 동일하게 하려면 설치 후 교체하면 됨 (지금은 아이콘 대체)
export default function HomePopular() {
    const apiKey = localStorage.getItem("TMDb-Key") || "";
    const [currentView, setCurrentView] = useState<"grid" | "list">("grid");

    // Angular ngOnInit(): disableScroll()
    useEffect(() => {
        // grid일 때 스크롤 막기
        document.body.style.overflow = currentView === "grid" ? "hidden" : "auto";

        // unmount 시 복구
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [currentView]);

    const fetchUrl = useMemo(() => {
        return urls.popular(apiKey, 1); // Angular: urlService.getURL4PopularMovies(apiKey)
    }, [apiKey]);

    return (
        <div className="popular-container">
            <div className="view-toggle">
                <button
                    onClick={() => setCurrentView("grid")}
                    className={currentView === "grid" ? "active" : ""}
                    aria-label="grid view"
                >
                    {/* faTh 자리 */}
                    ⬛⬜
                </button>

                <button
                    onClick={() => setCurrentView("list")}
                    className={currentView === "list" ? "active" : ""}
                    aria-label="list view"
                >
                    {/* faBars 자리 */}
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