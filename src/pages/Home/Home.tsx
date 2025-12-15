import { useEffect, useState } from "react";
import { Movie } from "../../types/movie";
import { urls } from "../../api/urls";
import MovieRow from "../../components/Movie/MovieRow";
import axios from "axios";
import Banner from "../../pages/Home/Banner";

export default function Home() {
    const apiKey = localStorage.getItem("TMDb-Key")!;
    const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
    const [popular, setPopular] = useState<Movie[]>([]);
    const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
    const [genre28, setGenre28] = useState<Movie[]>([]);
    const [genre35, setGenre35] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [p, n, g1, g2] = await Promise.all([
                    axios.get(urls.popular(apiKey, 1)),
                    axios.get(urls.nowPlaying(apiKey, 1)),
                    axios.get(urls.genre(apiKey, "28", 1)), // Action
                    axios.get(urls.genre(apiKey, "35", 1)), // Comedy
                ]);

                setPopular(p.data.results);
                setFeaturedMovie((p.data.results && p.data.results.length > 0) ? p.data.results[0] : null);
                setNowPlaying(n.data.results);
                setGenre28(g1.data.results);
                setGenre35(g2.data.results);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [apiKey]);

    if (loading) return <div className="page">Loading...</div>;

    return (
        <div className="page">
            <Banner movie={featuredMovie} />
            <MovieRow title="🔥 Popular Movies" movies={popular} />
            <MovieRow title="🎬 Now Playing" movies={nowPlaying} />
            <MovieRow title="💥 Action" movies={genre28} />
            <MovieRow title="😂 Comedy" movies={genre35} />
        </div>
    );
}