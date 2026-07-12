-- ==========================================
-- Create Contact Messages Table
-- ==========================================
-- For storing contact form submissions

-- STEP 1: Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);

-- STEP 3: Enable Row Level Security (RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- STEP 4: RLS Policy - Anyone can insert (public form submission)
CREATE POLICY "Anyone can submit contact form"
ON contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- STEP 5: RLS Policy - Only authenticated users (admin) can view
CREATE POLICY "Admin can view all messages"
ON contact_messages FOR SELECT
USING (auth.uid() IS NOT NULL);

-- STEP 6: RLS Policy - Only authenticated users (admin) can update
CREATE POLICY "Admin can update messages"
ON contact_messages FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- STEP 7: RLS Policy - Only authenticated users (admin) can delete
CREATE POLICY "Admin can delete messages"
ON contact_messages FOR DELETE
USING (auth.uid() IS NOT NULL);

-- STEP 8: Create function to update timestamp
CREATE OR REPLACE FUNCTION update_contact_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 9: Create trigger for auto-updating timestamp
DROP TRIGGER IF EXISTS contact_messages_updated_at ON contact_messages;
CREATE TRIGGER contact_messages_updated_at
BEFORE UPDATE ON contact_messages
FOR EACH ROW
EXECUTE FUNCTION update_contact_updated_at();

-- STEP 10: Create function to get message statistics
CREATE OR REPLACE FUNCTION get_contact_stats()
RETURNS TABLE (
  total_messages BIGINT,
  unread_messages BIGINT,
  read_messages BIGINT,
  replied_messages BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_messages,
    COUNT(*) FILTER (WHERE status = 'unread') as unread_messages,
    COUNT(*) FILTER (WHERE status = 'read') as read_messages,
    COUNT(*) FILTER (WHERE status = 'replied') as replied_messages
  FROM contact_messages;
END;
$$ LANGUAGE plpgsql;

-- STEP 11: Verify setup
SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 10;

-- STEP 12: Check statistics
SELECT * FROM get_contact_stats();

/*
==========================================
CONTACT MESSAGES FEATURES:
==========================================

✅ Public Submission: Anyone can submit form
✅ Admin Only View: Only authenticated users can view/manage
✅ Status Tracking: unread, read, replied
✅ Admin Notes: Add internal notes
✅ Timestamps: Auto-tracking creation and updates
✅ Email Index: Quick search by email
✅ Statistics Function: Get message counts

==========================================
FIELDS:
==========================================

- id: Unique identifier (UUID)
- name: Sender's name
- email: Sender's email
- phone: Sender's phone (optional)
- message: Message content
- status: unread | read | replied
- admin_notes: Internal notes (admin only)
- created_at: Submission timestamp
- updated_at: Last update timestamp

==========================================
EXAMPLE: View Unread Messages
==========================================

SELECT * FROM contact_messages 
WHERE status = 'unread' 
ORDER BY created_at DESC;

==========================================
EXAMPLE: Mark as Read
==========================================

UPDATE contact_messages 
SET status = 'read' 
WHERE id = 'uuid-here';

==========================================
EXAMPLE: Add Admin Notes
==========================================

UPDATE contact_messages 
SET status = 'replied',
    admin_notes = 'Replied via email on 2026-07-12'
WHERE id = 'uuid-here';

==========================================
EXAMPLE: Get Statistics
==========================================

SELECT * FROM get_contact_stats();

Result:
total_messages | unread_messages | read_messages | replied_messages
---------------|-----------------|---------------|------------------
     50        |       10        |      25       |        15

==========================================
BENEFITS:
==========================================

✅ No authentication required for submission
✅ All submissions stored in database
✅ Admin can view and manage messages
✅ Status tracking for follow-up
✅ Admin notes for internal tracking
✅ Statistics for monitoring
✅ Email indexing for quick search

*/

