import { useEffect, useState } from "react";
import { Movie } from "../../types/movie";
import { urls } from "../../api/urls";
import MovieRow from "../../components/Movie/MovieRow";
import axios from "axios";
import Banner from "../../pages/Home/Banner";
import "./Home.css";

export default function Home() {
  const apiKey = localStorage.getItem("TMDb-Key") || "";
  const hasApiKey = apiKey.trim().length > 0;
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [genre28, setGenre28] = useState<Movie[]>([]);
  const [genre35, setGenre35] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasApiKey) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        const [p, n, g1, g2] = await Promise.all([
          axios.get(urls.popular(apiKey, 1)),
          axios.get(urls.nowPlaying(apiKey, 1)),
          axios.get(urls.genre(apiKey, "28", 1)),
          axios.get(urls.genre(apiKey, "35", 1)),
        ]);

        setPopular(p.data.results);
        setFeaturedMovie(p.data.results?.[0] ?? null);
        setNowPlaying(n.data.results);
        setGenre28(g1.data.results);
        setGenre35(g2.data.results);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [apiKey, hasApiKey]);

  if (loading) return <div className="page">Loading...</div>;

  if (!hasApiKey) {
    return (
        <div className="page" style={{ padding: 24 }}>
          <h2 style={{ marginBottom: 12 }}>TMDB API Key가 없습니다.</h2>
          <p style={{ marginBottom: 8 }}>
            로그인/회원가입 화면에서 <b>비밀번호(Password)</b> 칸에 TMDB API Key를 입력해 저장해야 영화가 표시됩니다.
          </p>
          <p style={{ opacity: 0.8 }}>
            (localStorage의 <code>TMDb-Key</code> 값이 비어있어서 TMDB 요청이 실패한 상태입니다.)
          </p>
        </div>
    );
  }

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