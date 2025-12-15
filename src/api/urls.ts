const BASE_URL = "https://api.themoviedb.org/3";

export const urls = {
    popular: (apiKey: string, page: number = 1) =>
        `${BASE_URL}/movie/popular?api_key=${apiKey}&language=ko-KR&page=${page}`,

    nowPlaying: (apiKey: string, page: number = 1) =>
        `${BASE_URL}/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=${page}`,

    genre: (apiKey: string, genre: string, page: number = 1) =>
        `${BASE_URL}/discover/movie?api_key=${apiKey}&with_genres=${genre}&language=ko-KR&page=${page}`,
};