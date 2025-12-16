import { useMemo, useState } from "react";
import "./HomeSearch.css";
import MovieSearch from "../../../components/Search/MovieSearch";
import MovieInfiniteScroll from "../../../components/Views/MovieInfiniteScroll";
import type { SearchOptions } from "../../../types/search";

export default function HomeSearch() {
    const apiKey: string = localStorage.getItem("TMDb-Key") || "";

    // Angular 기본값 동일
    const [genreId, setGenreId] = useState<string>("28");
    const [ageId, setAgeId] = useState<number>(-1);
    const [sortId, setSortId] = useState<string>("all");

    const genreCode = useMemo(
        () => ({
            "장르 (전체)": 0,
            Action: 28,
            Adventure: 12,
            Comedy: 35,
            Crime: 80,
            Family: 10751,
        }),
        []
    );

    const sortingCode = useMemo(
        () => ({
            "언어 (전체)": "all",
            영어: "en",
            한국어: "ko",
        }),
        []
    );

    const ageCode = useMemo(
        () => ({
            "평점 (전체)": -1,
            "9~10": 9,
            "8~9": 8,
            "7~8": 7,
            "6~7": 6,
            "5~6": 5,
            "4~5": 4,
            "4점 이하": -2,
        }),
        []
    );

    // Angular: changeOptions(options: SearchOptions)
    const changeOptions = (options: SearchOptions) => {
        setGenreId(String(genreCode[options.originalLanguage] ?? 0));
        setAgeId(ageCode[options.translationLanguage] ?? -1);
        setSortId(sortingCode[options.sorting] ?? "all");
    };

    return (
        <div className="container-search home-search">
            <div className="container-search-bar">
                <MovieSearch onChangeOptions={changeOptions} />
            </div>

            <div className="content-search">
                <MovieInfiniteScroll
                    apiKey={apiKey}
                    genreCode={genreId}
                    sortingOrder={sortId}
                    voteEverage={ageId}
                />
            </div>
        </div>
    );
}