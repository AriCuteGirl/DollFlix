import { NextRequest, NextResponse } from "next/server";
import type { Title } from "@/lib/content";

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

type TmdbSearchResponse = {
  results?: TmdbMovie[];
};

const imageBase = "https://image.tmdb.org/t/p";

export async function GET(request: NextRequest) {
  const token = process.env.TMDB_ACCESS_TOKEN;
  const q = request.nextUrl.searchParams.get("q");

  if (!token || !q) return NextResponse.json({ results: [] });

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}&language=en-US&page=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
        next: { revalidate: 60 },
      },
    );
    if (!response.ok) throw new Error(`TMDB ${response.status}`);
    const data = (await response.json()) as TmdbSearchResponse;

    const results: Title[] = (data.results ?? []).slice(0, 12).map((movie) => {
      const year = (movie.release_date ?? "2026").slice(0, 4);
      const rating = Math.round((movie.vote_average ?? 0) * 10);
      return {
        id: `tmdb-${movie.id}`,
        tmdbId: movie.id,
        title: movie.title ?? movie.name ?? "Untitled",
        meta: `${year} • TMDB`,
        rating: `${rating}%`,
        runtime: "—",
        genres: ["Cinema"],
        poster: movie.poster_path
          ? `${imageBase}/w500${movie.poster_path}`
          : `/poster-1.svg`,
        backdrop: movie.backdrop_path
          ? `${imageBase}/w1280${movie.backdrop_path}`
          : `/backdrop-1.svg`,
        description: movie.overview || "A Dollflix cabinet selection.",
      };
    });

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
