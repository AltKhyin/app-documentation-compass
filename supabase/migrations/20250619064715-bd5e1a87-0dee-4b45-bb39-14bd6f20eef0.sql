
-- EVIDENS Community v2.0 Schema Enhancements
-- Milestone 1, Task 1.1: Database Schema Evolution

-- 1. Create Communities table for future expansion and current community metadata
CREATE TABLE IF NOT EXISTS "Communities" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    member_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable RLS on Communities table
ALTER TABLE "Communities" ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies for Communities
CREATE POLICY "Communities are publicly viewable" 
ON "Communities" FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage communities" 
ON "Communities" FOR ALL 
USING (get_my_claim('role') IN ('admin', 'editor')) 
WITH CHECK (get_my_claim('role') IN ('admin', 'editor'));

-- 4. Insert default "Comunidade" space with deterministic UUID for easy reference
INSERT INTO "Communities" (id, name, description, banner_url) 
VALUES (
    'a7d8e9f0-a1b2-c3d4-e5f6-a7b8c9d0e1f2'::uuid, 
    'Comunidade', 
    'Discussões e insights sobre evidências científicas.',
    '/lovable-uploads/community-banner-default.jpg'
) ON CONFLICT (id) DO NOTHING;

-- 5. Add new columns to CommunityPosts table for rich content support
ALTER TABLE "CommunityPosts" 
ADD COLUMN IF NOT EXISTS post_type TEXT NOT NULL DEFAULT 'text',
ADD COLUMN IF NOT EXISTS structured_content JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS community_id UUID REFERENCES "Communities"(id) DEFAULT 'a7d8e9f0-a1b2-c3d4-e5f6-a7b8c9d0e1f2'::uuid;

-- 6. Add CHECK constraint for post_type validation
ALTER TABLE "CommunityPosts" 
DROP CONSTRAINT IF EXISTS communityposts_post_type_check;

ALTER TABLE "CommunityPosts" 
ADD CONSTRAINT communityposts_post_type_check 
CHECK (post_type IN ('text', 'image', 'link', 'poll'));

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_communityposts_post_type ON "CommunityPosts"(post_type);
CREATE INDEX IF NOT EXISTS idx_communityposts_community_id ON "CommunityPosts"(community_id);
CREATE INDEX IF NOT EXISTS idx_communities_name ON "Communities"(name);

-- 8. Create centralized post action RPC (Milestone 1, Task 1.2)
CREATE OR REPLACE FUNCTION handle_post_action(
    p_post_id INTEGER,
    p_user_id UUID,
    p_action_type TEXT
)
RETURNS JSONB AS $$
DECLARE
    post_author_id UUID;
    is_authorized_moderator BOOLEAN;
    result_post "CommunityPosts";
BEGIN
    -- Fetch post author for permission checking
    SELECT author_id INTO post_author_id 
    FROM "CommunityPosts" 
    WHERE id = p_post_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'POST_NOT_FOUND: Post with ID % does not exist.', p_post_id;
    END IF;

    -- Check if user is authorized moderator
    SELECT is_editor(p_user_id) INTO is_authorized_moderator;

    -- Handle DELETE action (users can delete own posts, moderators can delete any)
    IF p_action_type = 'delete' THEN
        IF p_user_id = post_author_id OR is_authorized_moderator THEN
            DELETE FROM "CommunityPosts" WHERE id = p_post_id;
            RETURN jsonb_build_object('status', 'deleted', 'post_id', p_post_id);
        ELSE
            RAISE EXCEPTION 'FORBIDDEN: User does not have permission to delete this post.';
        END IF;
    END IF;

    -- For all other actions, require moderator privileges
    IF NOT is_authorized_moderator THEN
        RAISE EXCEPTION 'FORBIDDEN: Only editors or admins can perform this action.';
    END IF;

    -- Handle moderation actions
    CASE p_action_type
        WHEN 'pin' THEN
            UPDATE "CommunityPosts" SET is_pinned = true WHERE id = p_post_id RETURNING * INTO result_post;
        WHEN 'unpin' THEN
            UPDATE "CommunityPosts" SET is_pinned = false WHERE id = p_post_id RETURNING * INTO result_post;
        WHEN 'lock' THEN
            UPDATE "CommunityPosts" SET is_locked = true WHERE id = p_post_id RETURNING * INTO result_post;
        WHEN 'unlock' THEN
            UPDATE "CommunityPosts" SET is_locked = false WHERE id = p_post_id RETURNING * INTO result_post;
        ELSE
            RAISE EXCEPTION 'INVALID_ACTION: The action type "%" is not valid.', p_action_type;
    END CASE;

    RETURN to_jsonb(result_post);
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

-- 9. Update community stats function to include new metrics
CREATE OR REPLACE FUNCTION update_community_stats()
RETURNS void AS $$
BEGIN
    -- Update total discussions count
    INSERT INTO "CommunityStats" (stat_key, stat_value, updated_at)
    VALUES (
        'total_discussions',
        jsonb_build_object('count', (SELECT COUNT(*) FROM "CommunityPosts" WHERE parent_post_id IS NULL)),
        NOW()
    )
    ON CONFLICT (stat_key) 
    DO UPDATE SET 
        stat_value = EXCLUDED.stat_value,
        updated_at = EXCLUDED.updated_at;

    -- Update today's posts count
    INSERT INTO "CommunityStats" (stat_key, stat_value, updated_at)
    VALUES (
        'today_posts',
        jsonb_build_object('count', (
            SELECT COUNT(*) FROM "CommunityPosts" 
            WHERE created_at >= CURRENT_DATE
        )),
        NOW()
    )
    ON CONFLICT (stat_key) 
    DO UPDATE SET 
        stat_value = EXCLUDED.stat_value,
        updated_at = EXCLUDED.updated_at;

    -- Update active authors count (renamed from active_users_24h for accuracy)
    INSERT INTO "CommunityStats" (stat_key, stat_value, updated_at)
    VALUES (
        'active_authors_24h',
        jsonb_build_object('count', (
            SELECT COUNT(DISTINCT author_id) FROM "CommunityPosts" 
            WHERE created_at >= NOW() - INTERVAL '24 hours'
            AND author_id IS NOT NULL
        )),
        NOW()
    )
    ON CONFLICT (stat_key) 
    DO UPDATE SET 
        stat_value = EXCLUDED.stat_value,
        updated_at = EXCLUDED.updated_at;

    -- Update member count for default community
    UPDATE "Communities" 
    SET member_count = (
        SELECT COUNT(DISTINCT author_id) 
        FROM "CommunityPosts" 
        WHERE author_id IS NOT NULL
    )
    WHERE id = 'a7d8e9f0-a1b2-c3d4-e5f6-a7b8c9d0e1f2'::uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Execute initial stats update
SELECT update_community_stats();
