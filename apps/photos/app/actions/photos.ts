"use server";

import { unstable_cache } from "next/cache";
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

async function getPhotosUncached(category: Category): Promise<Photo[]> {
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
        return [];
    }

    return data || [];
}

export async function getPhotos(category: Category = 'all'): Promise<Photo[]> {
    try {
        const cached = unstable_cache(
            () => getPhotosUncached(category),
            ['photos', category],
            { revalidate: 3600, tags: ['photos', `photos-${category}`] }
        );
        return cached();
    } catch (error) {
        console.error('Error in getPhotos server action:', error);
        return [];
    }
}

