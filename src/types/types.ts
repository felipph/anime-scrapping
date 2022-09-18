export type Episode = {
  name: string;
  thumb: string;
  file: string;
};

export type Anime = {
  itemId: string;
  title: string;
  link: string | undefined;
  cover: string | undefined;
  // episodes: Episode[];
};

export type LambdaPayload = {
  maxPages?: number;
};
