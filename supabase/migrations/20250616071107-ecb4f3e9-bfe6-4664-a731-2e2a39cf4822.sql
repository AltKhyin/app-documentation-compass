
-- Create the Suggestion_Votes table for tracking individual votes
CREATE TABLE "Suggestion_Votes" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "suggestion_id" INTEGER NOT NULL REFERENCES "Suggestions"(id) ON DELETE CASCADE,
  "practitioner_id" UUID NOT NULL REFERENCES "Practitioners"(id) ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE("suggestion_id", "practitioner_id")
);

-- Enable RLS on the new table
ALTER TABLE "Suggestion_Votes" ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view all votes (for transparency)
CREATE POLICY "All users can view suggestion votes"
ON "Suggestion_Votes" FOR SELECT
USING (true);

-- RLS Policy: Authenticated users can cast votes
CREATE POLICY "Authenticated users can cast votes"
ON "Suggestion_Votes" FOR INSERT
WITH CHECK (auth.uid() = practitioner_id);

-- RLS Policy: Users can delete their own votes (retract)
CREATE POLICY "Users can retract their own votes"
ON "Suggestion_Votes" FOR DELETE
USING (auth.uid() = practitioner_id);

-- Create indexes for performance optimization
CREATE INDEX "idx_suggestion_votes_suggestion_id" ON "Suggestion_Votes"("suggestion_id");
CREATE INDEX "idx_suggestion_votes_practitioner_id" ON "Suggestion_Votes"("practitioner_id");

-- Add a trigger to update suggestion upvotes count when votes are added/removed
CREATE OR REPLACE FUNCTION update_suggestion_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE "Suggestions" 
    SET upvotes = upvotes + 1 
    WHERE id = NEW.suggestion_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE "Suggestions" 
    SET upvotes = upvotes - 1 
    WHERE id = OLD.suggestion_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for vote count updates
CREATE TRIGGER trigger_update_suggestion_vote_count_insert
  AFTER INSERT ON "Suggestion_Votes"
  FOR EACH ROW
  EXECUTE FUNCTION update_suggestion_vote_count();

CREATE TRIGGER trigger_update_suggestion_vote_count_delete
  AFTER DELETE ON "Suggestion_Votes"
  FOR EACH ROW
  EXECUTE FUNCTION update_suggestion_vote_count();

-- Update Suggestions table to include submitted_by foreign key reference
ALTER TABLE "Suggestions" 
ADD CONSTRAINT "fk_suggestions_submitted_by" 
FOREIGN KEY ("submitted_by") REFERENCES "Practitioners"("id") ON DELETE SET NULL;

-- Enable RLS on Suggestions table if not already enabled
ALTER TABLE "Suggestions" ENABLE ROW LEVEL SECURITY;

-- RLS Policy: All users can view suggestions
CREATE POLICY "All users can view suggestions"
ON "Suggestions" FOR SELECT
USING (true);

-- RLS Policy: Authenticated users can submit suggestions
CREATE POLICY "Authenticated users can submit suggestions"
ON "Suggestions" FOR INSERT
WITH CHECK (auth.uid() = submitted_by);

-- RLS Policy: Users can update their own suggestions (if needed for editing)
CREATE POLICY "Users can update their own suggestions"
ON "Suggestions" FOR UPDATE
USING (auth.uid() = submitted_by)
WITH CHECK (auth.uid() = submitted_by);
