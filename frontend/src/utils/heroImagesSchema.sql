-- Simple Hero Images Table (only image attribute)
-- Run this SQL in your Supabase SQL Editor

-- Create hero_images table with only image attribute
CREATE TABLE hero_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

-- Create policies for hero images (public read access)
CREATE POLICY "Hero images are viewable by everyone" ON hero_images FOR SELECT USING (true);

-- Create admin policies
CREATE POLICY "Admins can insert hero images" ON hero_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update hero images" ON hero_images FOR UPDATE USING (true);
CREATE POLICY "Admins can delete hero images" ON hero_images FOR DELETE USING (true);

-- Insert sample hero images with Supabase storage URLs
INSERT INTO hero_images (image) VALUES
('https://jwqfluocyhrwuzwrewgc.supabase.co/storage/v1/object/public/hero-images/hero-1.webp'),
('https://jwqfluocyhrwuzwrewgc.supabase.co/storage/v1/object/public/hero-images/hero-2.webp'),
('https://jwqfluocyhrwuzwrewgc.supabase.co/storage/v1/object/public/hero-images/hero-3.webp'),
('https://jwqfluocyhrwuzwrewgc.supabase.co/storage/v1/object/public/hero-images/hero-4.webp'),
('https://jwqfluocyhrwuzwrewgc.supabase.co/storage/v1/object/public/hero-images/hero-5.webp');
