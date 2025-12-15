import { useEffect, useMemo, useRef, useState } from "react";
import "./Wishlist.css";
import type { Movie } from "../../types/movie";
import { useWishlist } from "../../hooks/useWishlist";

export default function WishlistPage() {
    const gridRef = useRef<HTMLDivElement | null>(null);

    const { wishlist, toggleWishlist } = useWishlist();
    // ✅ 가정: useWishlist가 wishlist(Movie[])를 제공
    // 만약 없다면 아래 “체크 1줄” 참고

    const [rowSize, setRowSize] = useState(4);
    const [moviesPerPage, setMoviesPerPage] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const getImageUrl = (path: string | null | undefined) =>
        path ? `https://image.tmdb.org/t/p/w300${path}` : "/placeholder-image.jpg";

    // Angular: handleResize + calculateLayout
    useEffect(() => {
        const calculateLayout = () => {
            if (!gridRef.current) return;

            const containerWidth = gridRef.current.offsetWidth;
            const containerHeight = window.innerHeight - gridRef.current.offsetTop;

            const movieCardWidth = isMobile ? 90 : 220;
            const movieCardHeight = isMobile ? 150 : 330;
            const horizontalGap = isMobile ? 10 : 15;
            const verticalGap = -10;

            const rs = Math.max(1, Math.floor(containerWidth / (movieCardWidth + horizontalGap)));
            const maxRows = Math.max(1, Math.floor(containerHeight / (movieCardHeight + verticalGap)));

            setRowSize(rs);
            setMoviesPerPage(rs * maxRows);
        };

        const onResize = () => {
            setIsMobile(window.innerWidth <= 768);
            calculateLayout();
        };

        // ResizeObserver: Angular와 동일 컨셉
        const ro = new ResizeObserver(() => calculateLayout());
        if (gridRef.current) ro.observe(gridRef.current);

        window.addEventListener("resize", onResize);
        calculateLayout();

        return () => {
            window.removeEventListener("resize", onResize);
            ro.disconnect();
        };
    }, [isMobile]);

    // wishlist 변화 시 현재 페이지가 범위를 넘어가면 보정
    useEffect(() => {
        const totalPages = Math.max(1, Math.ceil(wishlist.length / moviesPerPage));
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [wishlist.length, moviesPerPage, currentPage]);

    const totalPages = Math.ceil(wishlist.length / moviesPerPage);

    // Angular: updateVisibleMovies + visibleWishlistMovies
    const visibleGroups = useMemo(() => {
        const startIndex = (currentPage - 1) * moviesPerPage;
        const endIndex = startIndex + moviesPerPage;
        const paginated = wishlist.slice(startIndex, endIndex);

        return paginated.reduce<Movie[][]>((groups, movie, idx) => {
            const gi = Math.floor(idx / rowSize);
            if (!groups[gi]) groups[gi] = [];
            groups[gi].push(movie);
            return groups;
        }, []);
    }, [wishlist, currentPage, moviesPerPage, rowSize]);

    return (
        <div className="movie-grid" ref={gridRef}>
            <div className="grid-container grid">
                {visibleGroups.map((group, i) => (
                    <div className="movie-row" key={i}>
                        {group.map((movie) => (
                            <div
                                key={movie.id}
                                className="movie-card"
                                onClick={() => toggleWishlist(movie)}
                            >
                                <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
                                <div className="movie-title">{movie.title}</div>
                                <div className="wishlist-indicator">👍</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {wishlist.length === 0 && (
                <div className="empty-wishlist">위시리스트가 비어 있습니다.</div>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage((p) => p - 1)}
                        disabled={currentPage === 1}
                    >
                        &lt; 이전
                    </button>
                    <span>
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