import { useEffect, useMemo, useState } from "react";
import type { Movie } from "../types/movie";

const KEY = "movieWishlist";

export function useWishlist() {
    const [wishlist, setWishlist] = useState<Movie[]>(() => {
        const stored = localStorage.getItem(KEY);
        return stored ? (JSON.parse(stored) as Movie[]) : [];
    });

    useEffect(() => {
        localStorage.setItem(KEY, JSON.stringify(wishlist));
    }, [wishlist]);

    const isInWishlist = (movieId: number) => wishlist.some((m) => m.id === movieId);

    const toggleWishlist = (movie: Movie) => {
        setWishlist((prev) => {
            const exists = prev.some((m) => m.id === movie.id);
            return exists ? prev.filter((m) => m.id !== movie.id) : [...prev, movie];
        });
    };

    // Angular getCurrentWishlist() 대응
    const getCurrentWishlist = useMemo(() => wishlist, [wishlist]);

    return { wishlist, toggleWishlist, isInWishlist, getCurrentWishlist };
}