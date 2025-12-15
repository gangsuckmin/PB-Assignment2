import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import type { Movie } from "../../types/movie";
import { useWishlist } from "../../hooks/useWishlist";
import "./MovieInfiniteScroll.css";

interface APIResponse {
    results: Movie[];
    page: number;
    total_pages: number;
    total_results: number;
}

type Props = {
    genreCode: string; // "0" => popular, else discover with_genres
    apiKey: string;
    sortingOrder?: string; // "all" or language code
    voteEverage?: number; // -1 all, -2 <=4, else [n, n+1)

};

export default function MovieInfiniteScroll({
                                                genreCode,
                                                apiKey,
                                                sortingOrder = "all",
                                                voteEverage = 100,
                                            }: Props) {
    const gridRef = useRef<HTMLDivElement | null>(null);
    const loadingTriggerRef = useRef<HTMLDivElement | null>(null);

    const { toggleWishlist, isInWishlist } = useWishlist();

    const [movies, setMovies] = useState<Movie[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowSize, setRowSize] = useState(4);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [showTopButton, setShowTopButton] = useState(false);

    const wishlistTimer = useRef<number | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const getImageUrl = (path?: string | null) =>
        path ? `https://image.tmdb.org/t/p/w300${path}` : "/placeholder-image.jpg";

    const applyFilters = (arr: Movie[]) => {
        let movieArray = arr;

        if (sortingOrder !== "all") {
            movieArray = movieArray.filter((m) => m.original_language === sortingOrder);
        }

        movieArray = movieArray.filter((m) => {
            const v = m.vote_average ?? 0;
            if (voteEverage === -1) return true;
            if (voteEverage === -2) return v <= 4;
            return v >= voteEverage && v < voteEverage + 1;
        });

        return movieArray;
    };

    const fetchMovies = async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const url = genreCode === "0"
                ? "https://api.themoviedb.org/3/movie/popular"
                : "https://api.themoviedb.org/3/discover/movie";

            const params: Record<string, any> = {
                api_key: apiKey,
                language: "ko-KR",
                page: currentPage,
                per_page: 10,
            };

            if (genreCode !== "0") {
                params.with_genres = genreCode;
            }

            const res = await axios.get<APIResponse>(url, { params });
            const newMovies = res.data.results ?? [];

            if (newMovies.length > 0) {
                setMovies((prev) => applyFilters([...prev, ...newMovies]));
                setCurrentPage((p) => p + 1);
            } else {
                setHasMore(false);
            }
        } catch (e) {
            console.error("Error fetching movies:", e);
        } finally {
            setIsLoading(false);
        }
    };

    // Setup intersection observer (Angular setupIntersectionObserver)
    useEffect(() => {
        if (!loadingTriggerRef.current) return;

        observerRef.current?.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading && hasMore) {
                    fetchMovies();
                }
            },
            { rootMargin: "100px", threshold: 0.1 }
        );

        observerRef.current.observe(loadingTriggerRef.current);

        return () => {
            observerRef.current?.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMore, isLoading, genreCode, apiKey, sortingOrder, voteEverage]);

    // Initial fetch + reset when inputs change
    useEffect(() => {
        setMovies([]);
        setCurrentPage(1);
        setHasMore(true);

        // fetch first page using next tick so state is reset
        setTimeout(() => {
            fetchMovies();
        }, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [genreCode, apiKey, sortingOrder, voteEverage]);

    // Resize logic (Angular handleResize)
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;

            if (gridRef.current) {
                const containerWidth = gridRef.current.offsetWidth;
                const movieCardWidth = mobile ? 100 : 300;
                const horizontalGap = mobile ? 10 : 15;
                const rs = Math.max(1, Math.floor(containerWidth / (movieCardWidth + horizontalGap)));
                setRowSize(rs);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Scroll listener for top button (Angular handleScroll)
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setShowTopButton(scrollTop > 300);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Cleanup wishlist timer
    useEffect(() => {
        return () => {
            if (wishlistTimer.current) {
                clearTimeout(wishlistTimer.current);
            }
        };
    }, []);

    const visibleMovieGroups = useMemo(() => {
        return movies.reduce<Movie[][]>((resultArray, item, index) => {
            const groupIndex = Math.floor(index / rowSize);
            if (!resultArray[groupIndex]) resultArray[groupIndex] = [];
            resultArray[groupIndex].push(item);
            return resultArray;
        }, []);
    }, [movies, rowSize]);

    const onToggleWishlist = (movie: Movie) => {
        if (wishlistTimer.current) clearTimeout(wishlistTimer.current);
        wishlistTimer.current = window.setTimeout(() => {
            toggleWishlist(movie);
        }, 800);
    };

    const resetMovies = () => {
        setMovies([]);
        setCurrentPage(1);
        setHasMore(true);
        setTimeout(() => fetchMovies(), 0);
    };

    const scrollToTopAndReset = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        resetMovies();
    };

    return (
        <div className="movie-grid" ref={gridRef}>
            <div className={`grid-container grid`}>
                {visibleMovieGroups.map((group, i) => (
                    <div className="movie-row" key={i}>
                        {group.map((movie) => (
                            <div
                                key={movie.id}
                                className="movie-card"
                                onMouseUp={() => onToggleWishlist(movie)}
                            >
                                <img
                                    src={getImageUrl(movie.poster_path)}
                                    alt={movie.title}
                                    loading="lazy"
                                />
                                <div className="movie-title">{movie.title}</div>
                                {isInWishlist(movie.id) && (
                                    <div className="wishlist-indicator">👍</div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div ref={loadingTriggerRef} className="loading-trigger">
                {isLoading && (
                    <div className="loading-indicator">
                        <div className="spinner" />
                        <span>Loading...</span>
                    </div>
                )}
            </div>

            {showTopButton && (
                <button
                    className="top-button"
                    onClick={scrollToTopAndReset}
                    aria-label="맨 위로 이동"
                >
                    Top
                </button>
            )}
        </div>
    );
}