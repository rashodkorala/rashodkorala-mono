"use server";

import { createClient } from "@/utils/supabase/server";

export interface Photo {
    id: string;
    title: string;
    description: string | null;
    category: 'architecture' | 'nature' | 'street' | 'travel' | 'wildlife' | 'night' | 'abstract' | 'interior_spaces';
    image_url: string;
    alt_text: string | null;
    created_at: string;
    updated_at: string;
}

export type Category =
    | 'all'
    | 'architecture'
    | 'nature'
    | 'street'
    | 'travel'
    | 'wildlife'
    | 'night'
    | 'abstract'
    | 'interior_spaces';

export async function getPhotos(category: Category = 'all'): Promise<Photo[]> {
    try {
        // Use publishable (anon) key via server client.
        // Requires RLS/storage policies to allow public SELECT/reads.
        const supabase = await createClient();

        let query = supabase
            .from('photos')
            .select('*')
            .order('created_at', { ascending: false });

        if (category !== 'all') {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching photos:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            return [];
        }

        console.log(`Successfully fetched ${data?.length || 0} photos for category: ${category}`);
        return data || [];
    } catch (error) {
        console.error('Error in getPhotos server action:', error);
        return [];
    }
}

