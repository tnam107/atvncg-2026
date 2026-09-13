ALTER TABLE "Submission"
ADD COLUMN "trackingTokenHash" TEXT;

CREATE UNIQUE INDEX "Submission_trackingTokenHash_key"
ON "Submission"("trackingTokenHash");
