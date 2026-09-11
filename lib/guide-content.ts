import { artistCatalog, type ArtistProfileValue } from "@/lib/guide-catalog";
import {
  localGetGuideContent,
  localMutateGuideContent,
  type LocalGuideMutation,
} from "@/lib/local-database";
import { databaseConfigured, isProduction, prisma } from "@/lib/prisma";
import type { GuideArtist, GuideContent } from "@/lib/types";

function mergeArtists(profiles: Map<string, ArtistProfileValue>): GuideArtist[] {
  return artistCatalog.map((artist) => {
    const profile = profiles.get(artist.slug);
    return {
      ...artist,
      imageUrl: profile?.imageUrl || artist.imageUrl,
      role: profile?.role || null,
      content: profile?.content || null,
      hasProfile: Boolean(profile?.content),
    };
  });
}

export async function getGuideContent(): Promise<GuideContent> {
  if (!databaseConfigured) {
    if (isProduction) throw new Error("DATABASE_URL is required in production.");
    return localGetGuideContent();
  }

  const [profiles, glossary, episodes] = await Promise.all([
    prisma.artistGuide.findMany(),
    prisma.glossaryTerm.findMany({ orderBy: [{ sortOrder: "asc" }, { term: "asc" }] }),
    prisma.episodeGuide.findMany({ orderBy: { episodeNumber: "asc" } }),
  ]);
  const profileMap = new Map(
    profiles.map((profile) => [
      profile.artistSlug,
      { role: profile.role, content: profile.content, imageUrl: profile.imageUrl },
    ]),
  );
  return {
    artists: mergeArtists(profileMap),
    glossary: glossary.map(({ id, term, definition, sortOrder }) => ({
      id,
      term,
      definition,
      sortOrder,
    })),
    episodes: episodes.map(
      ({ id, episodeNumber, title, description, imageUrl, youtubeUrl }) => ({
        id,
        episodeNumber,
        title,
        description,
        imageUrl,
        youtubeUrl,
      }),
    ),
    storage: "postgresql",
  };
}

export type GuideMutation = LocalGuideMutation;

export async function mutateGuideContent(input: GuideMutation) {
  if (!databaseConfigured) {
    if (isProduction) throw new Error("DATABASE_URL is required in production.");
    return localMutateGuideContent(input);
  }

  if (input.action === "UPSERT_ARTIST") {
    await prisma.artistGuide.upsert({
      where: { artistSlug: input.slug },
      create: {
        artistSlug: input.slug,
        role: input.role || null,
        content: input.content,
        imageUrl: input.imageUrl || null,
      },
      update: {
        role: input.role || null,
        content: input.content,
        imageUrl: input.imageUrl || null,
      },
    });
  }
  if (input.action === "DELETE_ARTIST") {
    await prisma.artistGuide.deleteMany({ where: { artistSlug: input.slug } });
  }
  if (input.action === "CREATE_GLOSSARY") {
    await prisma.glossaryTerm.create({
      data: {
        term: input.term,
        definition: input.definition,
        sortOrder: (await prisma.glossaryTerm.count()) + 1,
      },
    });
  }
  if (input.action === "UPDATE_GLOSSARY") {
    await prisma.glossaryTerm.update({
      where: { id: input.id },
      data: { term: input.term, definition: input.definition },
    });
  }
  if (input.action === "DELETE_GLOSSARY") {
    await prisma.glossaryTerm.delete({ where: { id: input.id } });
  }
  if (input.action === "CREATE_EPISODE") {
    await prisma.episodeGuide.create({
      data: {
        episodeNumber: input.episodeNumber,
        title: input.title,
        description: input.description || null,
        imageUrl: input.imageUrl,
        youtubeUrl: input.youtubeUrl,
      },
    });
  }
  if (input.action === "UPDATE_EPISODE") {
    await prisma.episodeGuide.update({
      where: { id: input.id },
      data: {
        episodeNumber: input.episodeNumber,
        title: input.title,
        description: input.description || null,
        imageUrl: input.imageUrl,
        youtubeUrl: input.youtubeUrl,
      },
    });
  }
  if (input.action === "DELETE_EPISODE") {
    await prisma.episodeGuide.delete({ where: { id: input.id } });
  }
  return getGuideContent();
}
