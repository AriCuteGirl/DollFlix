import { NextRequest, NextResponse } from "next/server";

type TmdbVideo = {
  key: string;
  site: string;
  type: string;
  official?: boolean;
};

type TmdbVideosResponse = {
  results?: TmdbVideo[];
};

export async function GET(request: NextRequest) {
  const token = process.env.TMDB_ACCESS_TOKEN;
  const id = request.nextUrl.searchParams.get("id");

  if (!token || !id) return NextResponse.json({ trailerKey: null });

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
        next: { revalidate: 60 * 60 },
      },
    );
    if (!response.ok) throw new Error(`TMDB ${response.status}`);
    const data = (await response.json()) as TmdbVideosResponse;
    const trailer =
      (data.results ?? []).find(
        (v) => v.site === "YouTube" && v.type === "Trailer" && v.official,
      ) ??
      (data.results ?? []).find(
        (v) => v.site === "YouTube" && v.type === "Trailer",
      ) ??
      (data.results ?? []).find((v) => v.site === "YouTube");

    return NextResponse.json({ trailerKey: trailer?.key ?? null });
  } catch {
    return NextResponse.json({ trailerKey: null });
  }
}
