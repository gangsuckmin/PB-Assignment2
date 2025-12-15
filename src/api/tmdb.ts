import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

export const tmdb = axios.create({
    baseURL: BASE_URL,
    params: {
        language: "ko-KR",
    },
});

export const fetchFeaturedMovie = async (apiKey: string) => {
    try {
        const res = await tmdb.get("/movie/popular", {
            params: { api_key: apiKey },
        });
        return res.data.results[0];
    } catch (e) {
        console.error("Error fetching featured movie:", e);
        throw e;
    }
};