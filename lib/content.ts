export type Title = {
  id: string;
  title: string;
  meta: string;
  rating: string;
  runtime: string;
  genres: string[];
  poster: string;
  backdrop: string;
  tmdbId?: number;
  progress?: number;
  description: string;
};

export type ContentRowData = {
  title: string;
  items: Title[];
};

export const heroTitle = "Porcelain After Midnight";

const posters = [
  ["Porcelain After Midnight", "A haunted dollmaker restores memories inside a velvet cabinet of forbidden films.", "Gothic", "Fantasy"],
  ["Velvet Marionette", "A stage doll cuts her strings and wakes up inside a city-sized theater.", "Thriller", "Drama"],
  ["Ribbon House", "Collectors enter a pastel mansion where every room plays a different dream.", "Mystery", "4K"],
  ["Glass-Eyed Girls", "Twin dolls guard a cinema that only opens after the audience falls asleep.", "Noir", "Indie"],
  ["The Miniature Ball", "A royal dollhouse party becomes a glowing rebellion in twelve perfect rooms.", "Drama", "Music"],
  ["Lacework Moon", "A porcelain astronaut follows a cracked moonbeam back to her maker.", "Fantasy", "Series"],
  ["Button Heart", "A plush detective solves romances by reading stitches no one else can see.", "Comedy", "Cozy"],
  ["Static Ballerina", "An antique ballerina broadcasts pirate films through a music box antenna.", "Docu", "Cult"]
];

const makeTitle = (name: string, index: number, row: number): Title => ({
  id: `${row}-${index}`,
  title: name,
  meta: `${2026 - ((index + row) % 5)} • S${(index % 3) + 1}`,
  rating: `${92 + ((index + row) % 7)}%`,
  runtime: `${92 + index * 7} min`,
  genres: [posters[index % posters.length][2], posters[index % posters.length][3]],
  poster: `/poster-${(index % 8) + 1}.svg`,
  backdrop: `/backdrop-${(index % 4) + 1}.svg`,
  progress: row === 1 ? 18 + index * 9 : undefined,
  description: posters[index % posters.length][1]
});

export const contentRows: ContentRowData[] = [
  "Trending in the Dollhouse",
  "Continue Watching",
  "New in the Cabinet",
  "Porcelain Picks For You",
  "Hidden Music Box Gems"
].map((title, row) => ({
  title,
  items: posters.map(([name], index) => makeTitle(name, index, row))
}));

export const episodes = Array.from({ length: 8 }, (_, index) => ({
  number: index + 1,
  title: posters[index][0],
  runtime: `${42 + index * 3}m`,
  progress: index === 0 ? 64 : index < 3 ? 100 : 0,
  thumbnail: `/backdrop-${(index % 4) + 1}.svg`,
  description: posters[index][1]
}));
