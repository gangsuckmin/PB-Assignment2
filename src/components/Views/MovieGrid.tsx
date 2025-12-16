import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import type { Movie } from "../../types/movie";
import { useWishlist } from "../../hooks/useWishlist";
import "./MovieGrid.css";

type Props = {
    fetchUrl: string;
    title?: string; // HomePopular에서 넘기고 있으니 optional로 받아줌
};

export default function MovieGrid({ fetchUrl }: Props) {
    const gridRef = useRef<HTMLDivElement | null>(null);
    const { toggleWishlist, isInWishlist } = useWishlist();

    const [movies, setMovies] = useState<Movie[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowSize, setRowSize] = useState(4);
    const [moviesPerPage, setMoviesPerPage] = useState(20);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const wishlistTimer = useRef<number | null>(null);

    // ✅ useCallback으로 고정 → exhaustive-deps 경고 제거
    const calculateLayout = useCallback(() => {
        if (!gridRef.current) return;

        const containerWidth = gridRef.current.offsetWidth;
        const containerHeight = window.innerHeight - gridRef.current.offsetTop;

        const movieCardWidth = isMobile ? 90 : 200;
        const movieCardHeight = isMobile ? 150 : 220;
        const horizontalGap = isMobile ? 10 : 15;
        const verticalGap = -10;

        const rs = Math.max(1, Math.floor(containerWidth / (movieCardWidth + horizontalGap)));
        const maxRows = Math.max(1, Math.floor(containerHeight / (movieCardHeight + verticalGap)));

        setRowSize(rs);
        setMoviesPerPage(rs * maxRows);
    }, [isMobile]);

    /* ===== fetchMovies ===== */
    useEffect(() => {
        let alive = true;

        const fetchMovies = async () => {
            try {
                const totalMoviesNeeded = 120;
                const pages = Math.ceil(totalMoviesNeeded / 20);
                let all: Movie[] = [];

                for (let page = 1; page <= pages; page++) {
                    const res = await axios.get(fetchUrl, { params: { page } });
                    all = [...all, ...res.data.results];
                }

                if (alive) setMovies(all.slice(0, totalMoviesNeeded));
            } catch (e) {
                console.error("Error fetching movies:", e);
            }
        };

        fetchMovies();
        return () => {
            alive = false;
        };
    }, [fetchUrl]);

    /* ===== resize / layout ===== */
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);

        // 최초 계산
        calculateLayout();

        return () => {
            window.removeEventListener("resize", handleResize);
            if (wishlistTimer.current) clearTimeout(wishlistTimer.current);
        };
    }, [calculateLayout]);

    // isMobile 값 바뀌면 레이아웃 재계산
    useEffect(() => {
        calculateLayout();
    }, [isMobile, calculateLayout]);

    const visibleMovieGroups = useMemo(() => {
        const start = (currentPage - 1) * moviesPerPage;
        const end = start + moviesPerPage;
        const pageMovies = movies.slice(start, end);

        return pageMovies.reduce<Movie[][]>((groups, movie, idx) => {
            const gi = Math.floor(idx / rowSize);
            if (!groups[gi]) groups[gi] = [];
            groups[gi].push(movie);
            return groups;
        }, []);
    }, [movies, currentPage, moviesPerPage, rowSize]);

    const totalPages = Math.ceil(movies.length / moviesPerPage);

    const onToggleWishlist = (movie: Movie) => {
        if (wishlistTimer.current) clearTimeout(wishlistTimer.current);
        wishlistTimer.current = window.setTimeout(() => toggleWishlist(movie), 2000);
    };

    return (
        <div className="movie-grid" ref={gridRef}>
            <div className="grid-container grid">
                {visibleMovieGroups.map((group, i) => (
                    <div className="movie-row" key={i}>
                        {group.map((movie) => (
                            <div
                                key={movie.id}
                                className="movie-card"
                                onMouseUp={() => onToggleWishlist(movie)}
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                    alt={movie.title}
                                    loading="lazy"
                                />
                                <div className="movie-title">{movie.title}</div>
                                {isInWishlist(movie.id) && <div className="wishlist-indicator">👍</div>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage((p) => p - 1)}
                        disabled={currentPage === 1}
                    >
                        &lt; 이전
                    </button>
                    <span className="page-indicator">
            {currentPage} / {totalPages}
          </span>
                    <button
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={currentPage === totalPages}
                    >
                        다음 &gt;
                    </button>
                </div>
            )}
        </div>
    );
}