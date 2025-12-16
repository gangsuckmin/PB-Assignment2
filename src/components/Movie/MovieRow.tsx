import { useMemo, useRef } from "react";
import type { Movie } from "../../types/movie";
import { useWishlist } from "../../hooks/useWishlist";
import "./MovieRow.css";

type Props = {
    title: string;
    movies: Movie[];
};

export default function MovieRow({ title, movies }: Props) {
    const scrollerRef = useRef<HTMLDivElement | null>(null);
    const { toggleWishlist, isInWishlist } = useWishlist();

    const list = useMemo(() => movies?.filter((m) => m?.poster_path) ?? [], [movies]);

    const scrollByAmount = () => {
        const el = scrollerRef.current;
        if (!el) return 600;
        return Math.max(280, Math.floor(el.clientWidth * 0.8));
    };

    const scrollLeft = () => scrollerRef.current?.scrollBy({ left: -scrollByAmount(), behavior: "smooth" });
    const scrollRight = () => scrollerRef.current?.scrollBy({ left: scrollByAmount(), behavior: "smooth" });

    return (
        <section className="row">
            <div className="row__header">
                <h2 className="row__title">{title}</h2>
                <div className="row__controls">
                    <button type="button" className="row__arrow" onClick={scrollLeft} aria-label="왼쪽으로">
                        ‹
                    </button>
                    <button type="button" className="row__arrow" onClick={scrollRight} aria-label="오른쪽으로">
                        ›
                    </button>
                </div>
            </div>

            <div className="row__viewport">
                <div className="row__scroller" ref={scrollerRef}>
                    {list.map((movie) => (
                        <div
                            key={movie.id}
                            className={"row__card" + (isInWishlist(movie.id) ? " row__card--wish" : "")}
                            onMouseUp={() => toggleWishlist(movie)}
                        >
                            <img
                                className="row__poster"
                                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                alt={movie.title}
                                loading="lazy"
                            />
                            <div className="row__name" title={movie.title}>
                                {movie.title}
                            </div>
                            {isInWishlist(movie.id) && <div className="row__badge">👍</div>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}