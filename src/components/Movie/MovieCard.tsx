import type { Movie } from "../../types/movie";
import { useWishlist } from "../../hooks/useWishlist";

export default function MovieCard({ movie }: { movie: Movie }) {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const wished = isInWishlist(movie.id);

    const imgUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : "";

    return (
        <div
            className={`movie-card ${wished ? "wished" : ""}`}
            onClick={() => toggleWishlist(movie)}
            title={wished ? "찜 해제" : "찜 추가"}
        >
            {imgUrl && <img src={imgUrl} alt={movie.title} />}
            <p>{movie.title}</p>
        </div>
    );
}