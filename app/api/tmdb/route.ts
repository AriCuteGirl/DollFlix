import { NextResponse } from "next/server";
import type { ContentRowData, Title } from "@/lib/content";

type TmdbMovie = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
};

type TmdbResponse = {
  results?: TmdbMovie[];
};

const imageBase = "https://image.tmdb.org/t/p";

const genres = new Map([
  [12, "Adventure"],
  [14, "Fantasy"],
  [16, "Animation"],
  [18, "Drama"],
  [27, "Horror"],
  [28, "Action"],
  [35, "Comedy"],
  [53, "Thriller"],
  [878, "Sci-Fi"],
  [10751, "Family"],
]);

const endpoints = [
  ["Trending Now", "/trending/movie/week"],
  ["New Releases", "/movie/now_playing"],
  ["Dollhouse Classics", "/movie/top_rated"],
  ["Porcelain Picks", "/movie/popular"],
  [
    "Hidden Gems",
    "/discover/movie?sort_by=vote_count.desc&vote_average.gte=7.2&with_genres=14,18",
  ],
] as const;

export async function GET() {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) return NextResponse.json({ rows: [] }, { status: 200 });

  try {
    const rows = await Promise.all(
      endpoints.map(async ([title, path], rowIndex) => {
        const separator = path.includes("?") ? "&" : "?";
        const response = await fetch(
          `https://api.themoviedb.org/3${path}${separator}language=en-US&page=1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "application/json",
            },
            next: { revalidate: 60 * 60 },
          },
        );
        if (!response.ok) throw new Error(`TMDB ${response.status}`);
        const data = (await response.json()) as TmdbResponse;
        return {
          title,
          items: (data.results ?? [])
            .slice(0, 12)
            .map((movie, index) => toTitle(movie, rowIndex, index)),
        } satisfies ContentRowData;
      }),
    );
    return NextResponse.json({ rows });
  } catch {
    return NextResponse.json({ rows: [] }, { status: 200 });
  }
}

function toTitle(movie: TmdbMovie, row: number, index: number): Title {
  const year = (movie.release_date ?? movie.first_air_date ?? "2026").slice(
    0,
    4,
  );
  const rating = Math.round((movie.vote_average ?? 8.8) * 10);
  const genreNames = (movie.genre_ids ?? [])
    .slice(0, 2)
    .map((id) => genres.get(id))
    .filter(Boolean) as string[];
  return {
    id: `tmdb-${movie.id}`,
    tmdbId: movie.id,
    title: movie.title ?? movie.name ?? "Untitled",
    meta: `${year} • TMDB`,
    rating: `${rating}%`,
    runtime: `${92 + ((row + index) % 7) * 8} min`,
    genres: genreNames.length ? genreNames : ["Cinema", "Curated"],
    poster: movie.poster_path
      ? `${imageBase}/w500${movie.poster_path}`
      : `/poster-${(index % 8) + 1}.svg`,
    backdrop: movie.backdrop_path
      ? `${imageBase}/w1280${movie.backdrop_path}`
      : `/backdrop-${(index % 4) + 1}.svg`,
    progress: row === 0 ? undefined : row === 1 ? 12 + index * 6 : undefined,
    description:
      movie.overview ||
      "A handpicked Dollflix selection from the cinematic cabinet.",
  };
}
