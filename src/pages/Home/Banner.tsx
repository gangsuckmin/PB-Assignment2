import "./Banner.css";
import type { Movie } from "../../types/movie";

type Props = {
    movie: Movie | null;
};

export default function Banner({ movie }: Props) {
    if (!movie) return null;

    const bgUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null;

    return (
        <section className="hero-banner" aria-label="featured movie banner">
            <div
                className="hero-bg"
                style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined}
            />

            <div className="hero-content">
                <h1 className="hero-title">{movie.title}</h1>

                {movie.overview ? (
                    <p className="hero-overview">{movie.overview}</p>
                ) : (
                    <p className="hero-overview hero-overview--empty">
                        줄거리가 제공되지 않습니다.
                    </p>
                )}

                <div className="hero-actions">
                    <button type="button" className="hero-btn primary" aria-label="play">
                        ▶ Play
                    </button>
                    <button type="button" className="hero-btn secondary" aria-label="more info">
                        More Info
                    </button>
                </div>
            </div>
        </section>
    );
}