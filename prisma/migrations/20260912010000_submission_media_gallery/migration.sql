-- Keep the original mediaUrl/mediaType columns for backward compatibility while
-- storing new multi-media submissions as an ordered JSON array.
ALTER TABLE "Submission" ADD COLUMN "mediaItems" JSONB;

UPDATE "Submission"
SET "mediaItems" = jsonb_build_array(
  jsonb_build_object('url', "mediaUrl", 'type', "mediaType"::text)
)
WHERE "mediaUrl" IS NOT NULL AND "mediaType" IS NOT NULL;
