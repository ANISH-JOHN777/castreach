-- Update profiles table to have better defaults for new signups
-- Run this in Supabase SQL Editor

-- Add default values to existing columns
ALTER TABLE profiles 
  ALTER COLUMN bio SET DEFAULT '',
  ALTER COLUMN title SET DEFAULT '',
  ALTER COLUMN location SET DEFAULT '',
  ALTER COLUMN expertise SET DEFAULT '{}',
  ALTER COLUMN price SET DEFAULT 0,
  ALTER COLUMN rating SET DEFAULT 0,
  ALTER COLUMN total_reviews SET DEFAULT 0,
  ALTER COLUMN availability SET DEFAULT 'Available';

-- Update the trigger function to set better defaults
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        email, 
        name, 
        role,
        bio,
        title,
        location,
        expertise,
        avatar,
        price,
        rating,
        availability
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'guest'),
        COALESCE(NEW.raw_user_meta_data->>'bio', 'New to CastReach'),
        COALESCE(NEW.raw_user_meta_data->>'title', 
            CASE 
                WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'guest') = 'guest' THEN 'Podcast Guest'
                WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'guest') = 'host' THEN 'Podcast Host'
                ELSE 'Podcast Organizer'
            END
        ),
        COALESCE(NEW.raw_user_meta_data->>'location', 'Remote'),
        COALESCE((NEW.raw_user_meta_data->>'expertise')::text[], ARRAY['General']),
        CONCAT('https://ui-avatars.com/api/?name=', 
               COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
               '&background=6366f1&color=fff'),
        COALESCE((NEW.raw_user_meta_data->>'price')::decimal, 0),
        0,
        'Available'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- The trigger already exists, so we just updated the function
