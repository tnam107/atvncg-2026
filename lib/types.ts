export type SubmissionTypeValue = "LETTER" | "MEMORY" | "FANMADE" | "CALL";
export type SubmissionStatusValue = "PENDING" | "APPROVED" | "REJECTED";
export type MediaTypeValue = "IMAGE" | "VIDEO";

export type PublicSubmission = {
  id: string;
  type: SubmissionTypeValue;
  authorName: string;
  targetId: string | null;
  title: string | null;
  content: string;
  mediaUrl: string | null;
  mediaType: MediaTypeValue | null;
  status?: SubmissionStatusValue;
  adminNote?: string | null;
  likesCount: number;
  createdAt: string;
};

export type GuideArtist = {
  slug: string;
  name: string;
  imageUrl: string;
  role: string | null;
  content: string | null;
  hasProfile: boolean;
};

export type GuideGlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  sortOrder: number;
};

export type GuideEpisode = {
  id: string;
  episodeNumber: number;
  title: string;
  description: string | null;
  imageUrl: string;
  youtubeUrl: string;
};

export type GuideContent = {
  artists: GuideArtist[];
  glossary: GuideGlossaryTerm[];
  episodes: GuideEpisode[];
  storage?: "sqlite" | "postgresql";
};
