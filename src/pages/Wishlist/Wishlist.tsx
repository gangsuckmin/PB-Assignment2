import { useEffect, useMemo, useRef, useState } from "react";
import "./Wishlist.css";
import type { Movie } from "../../types/movie";
import { useWishlist } from "../../hooks/useWishlist";
import MovieCard from "../../components/Movie/MovieCard";

export default function WishlistPage() {
    const gridRef = useRef<HTMLDivElement | null>(null);
    const { wishlist } = useWishlist();

    const [rowSize, setRowSize] = useState(4);
    const [moviesPerPage, setMoviesPerPage] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    /* ===== layout 계산 (Angular 로직 그대로) ===== */
    useEffect(() => {
        const calculateLayout = () => {
            if (!gridRef.current) return;

            const containerWidth = gridRef.current.offsetWidth;
            const containerHeight = window.innerHeight - gridRef.current.offsetTop;

            const cardWidth = isMobile ? 120 : 220;
            const cardHeight = isMobile ? 180 : 330;
            const horizontalGap = isMobile ? 10 : 15;
            const verticalGap = -10;

            const rs = Math.max(1, Math.floor(containerWidth / (cardWidth + horizontalGap)));
            const maxRows = Math.max(
                1,
                Math.floor(containerHeight / (cardHeight + verticalGap))
            );

            setRowSize(rs);
            setMoviesPerPage(rs * maxRows);
        };

        const onResize = () => {
            setIsMobile(window.innerWidth <= 768);
            calculateLayout();
        };

        const ro = new ResizeObserver(calculateLayout);
        if (gridRef.current) ro.observe(gridRef.current);

        window.addEventListener("resize", onResize);
        calculateLayout();

        return () => {
            window.removeEventListener("resize", onResize);
            ro.disconnect();
        };
    }, [isMobile]);

    /* ===== 페이지 보정 ===== */
    useEffect(() => {
        const totalPages = Math.max(1, Math.ceil(wishlist.length / moviesPerPage));
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [wishlist.length, moviesPerPage, currentPage]);

    const totalPages = Math.ceil(wishlist.length / moviesPerPage);

    /* ===== 화면에 보일 영화 그룹 ===== */
    const visibleGroups = useMemo(() => {
        const start = (currentPage - 1) * moviesPerPage;
        const end = start + moviesPerPage;
        const pageMovies = wishlist.slice(start, end);

        return pageMovies.reduce<Movie[][]>((groups, movie, idx) => {
            const gi = Math.floor(idx / rowSize);
            if (!groups[gi]) groups[gi] = [];
            groups[gi].push(movie);
            return groups;
        }, []);
    }, [wishlist, currentPage, moviesPerPage, rowSize]);

    return (
        <div className="wishlist-page" ref={gridRef}>
            {/* ===== EMPTY STATE ===== */}
            {wishlist.length === 0 && (
                <div className="empty-wishlist">
                    <h2>아직 찜한 영화가 없어요</h2>
                    <p>마음에 드는 영화를 👍 버튼으로 추가해 보세요.</p>
                </div>
            )}

            {/* ===== GRID ===== */}
            {wishlist.length > 0 && (
                <div className="grid-container grid">
                    {visibleGroups.map((group, i) => (
                        <div className="movie-row" key={i}>
                            {group.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* ===== PAGINATION ===== */}
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