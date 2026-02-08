-- Function to increment case study views
-- This allows tracking how many times each case study is viewed

CREATE OR REPLACE FUNCTION increment_case_study_views(case_study_slug text)
RETURNS void AS $$
BEGIN
  UPDATE case_studies 
  SET views = views + 1 
  WHERE slug = case_study_slug 
    AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_case_study_views(text) TO authenticated;

-- Grant execute permission to anonymous users (for public viewing)
GRANT EXECUTE ON FUNCTION increment_case_study_views(text) TO anon;





