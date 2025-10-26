
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'communities' 
ORDER BY table_name, ordinal_position;

-- Check budget_requests table structure
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'budget_requests' 
ORDER BY table_name, ordinal_position;

-- Add foreign key constraint if it doesn't exist
-- Note: This might fail if communities table doesn't exist or has different structure
DO $$
BEGIN
    -- Check if foreign key constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'budget_requests_community_id_fkey'
    ) THEN
        -- Try to add foreign key constraint
        BEGIN
            ALTER TABLE budget_requests 
            ADD CONSTRAINT budget_requests_community_id_fkey 
            FOREIGN KEY (community_id) REFERENCES communities(id);
            
            RAISE NOTICE 'Foreign key constraint added successfully';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not add foreign key constraint: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'Foreign key constraint already exists';
    END IF;
END $$;

-- Verify the relationship
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'budget_requests';