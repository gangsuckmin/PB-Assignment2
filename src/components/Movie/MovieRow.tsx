import { Movie } from "../../types/movie";
import MovieCard from "./MovieCard";

interface Props {
    title: string;
    movies: Movie[];
}

export default function MovieRow({ title, movies }: Props) {
    return (
        <section className="movie-row">
            <h2>{title}</h2>
            <div className="movie-row-list">
                {movies.map((m) => (
                    <MovieCard key={m.id} movie={m} />
                ))}
            </div>
        </section>
    );
}