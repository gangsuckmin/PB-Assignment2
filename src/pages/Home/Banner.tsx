import "./Banner.css";
import type { Movie } from "../../types/movie";

type Props = {
    movie: Movie | null;
};

export default function Banner({ movie }: Props) {
    if (!movie) return null;

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : "";

    return (
        <div
            className="banner"
            style={{ backgroundImage: backdropUrl ? `url(${backdropUrl})` : undefined }}
        >
            <div className="banner-content">
                <h1>{movie.title}</h1>
                <p>{movie.overview}</p>
                <button className="play-btn title-btn">재생</button>
                <button className="info-btn title-btn">상세 정보</button>
            </div>
        </div>
    );
}