import type { Movie } from "../../types/movie";
import { useWishlist } from "../../hooks/useWishlist";
import "./MovieCard.css";

export default function MovieCard({ movie }: { movie: Movie }) {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const wished = isInWishlist(movie.id);

    const imgUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : "";

    return (
        <button
            type="button"
            className={`movie-card ${wished ? "wished" : ""}`}
            onMouseUp={() => toggleWishlist(movie)}
            title={wished ? "찜 해제" : "찜 추가"}
        >
            <div className="movie-card__imgWrap">
                {imgUrl ? (
                    <img className="movie-card__img" src={imgUrl} alt={movie.title} loading="lazy" />
                ) : (
                    <div className="movie-card__placeholder" aria-hidden="true" />
                )}
                {wished && <div className="movie-card__badge">👍</div>}
            </div>
            <div className="movie-card__title" title={movie.title}>
                {movie.title}
            </div>
        </button>
    );
}