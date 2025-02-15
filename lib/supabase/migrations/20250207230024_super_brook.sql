/*
  # Add Image Storage Support

  1. Changes
    - Add storage bucket for images
    - Add policies for image access
    - Add indexes for image URLs

  2. Security
    - Enable RLS for storage
    - Add policies for authenticated users
*/

-- Enable storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images');

-- Create policy to allow public to view images
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'images');

-- Add indexes for image URLs
CREATE INDEX IF NOT EXISTS designs_image_url_idx ON public.designs(image_url);
CREATE INDEX IF NOT EXISTS chat_messages_image_url_idx ON public.chat_messages(image_url);