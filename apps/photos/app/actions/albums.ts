"use server";

import { createClient } from "@/utils/supabase/server";

export interface AlbumSummary {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  location: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  tags: string[];
  featured: boolean;
  photoCount: number;
}

export interface AlbumPhoto {
  id: string;
  photoId: string;
  caption: string | null;
  position: number;
  imageUrl: string;
  title: string;
  altText: string | null;
}

export interface AlbumDetail extends AlbumSummary {
  photos: AlbumPhoto[];
}

export async function getAlbums(): Promise<AlbumSummary[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("albums")
      .select("id, slug, title, description, cover_path, location, date_from, date_to, tags, featured")
      .eq("status", "published")
      .order("order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching albums:", error);
      return [];
    }

    const albums = await Promise.all(
      (data || []).map(async (album: Record<string, unknown>) => {
        const { count } = await supabase
          .from("album_photos")
          .select("*", { count: "exact", head: true })
          .eq("album_id", album.id);

        let coverUrl: string | null = null;
        if (album.cover_path) {
          const { data: urlData } = supabase.storage
            .from("media")
            .getPublicUrl(album.cover_path as string);
          coverUrl = urlData.publicUrl;
        }

        return {
          id: album.id as string,
          slug: album.slug as string,
          title: album.title as string,
          description: (album.description as string | null) ?? null,
          coverUrl,
          location: (album.location as string | null) ?? null,
          dateFrom: (album.date_from as string | null) ?? null,
          dateTo: (album.date_to as string | null) ?? null,
          tags: (album.tags as string[]) || [],
          featured: album.featured as boolean,
          photoCount: count ?? 0,
        };
      })
    );

    return albums;
  } catch (err) {
    console.error("Error in getAlbums:", err);
    return [];
  }
}

export async function getAlbum(slug: string): Promise<AlbumDetail | null> {
  try {
    const supabase = await createClient();

    const { data: albumData, error: albumError } = await supabase
      .from("albums")
      .select("id, slug, title, description, cover_path, location, date_from, date_to, tags, featured")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (albumError) {
      if (albumError.code === "PGRST116") return null;
      console.error("Error fetching album:", albumError);
      return null;
    }

    if (!albumData) return null;

    const { data: entries, error: entriesError } = await supabase
      .from("album_photos")
      .select("id, photo_id, caption, position, photos(id, image_url, title, alt_text)")
      .eq("album_id", albumData.id)
      .order("position", { ascending: true });

    if (entriesError) {
      console.error("Error fetching album photos:", entriesError);
    }

    const photos: AlbumPhoto[] = (entries || []).map((entry: Record<string, unknown>) => {
      const photo = entry.photos as { id: string; image_url: string; title: string; alt_text: string | null } | null;
      return {
        id: entry.id,
        photoId: entry.photo_id,
        caption: entry.caption ?? null,
        position: entry.position,
        imageUrl: photo?.image_url ?? "",
        title: photo?.title ?? "",
        altText: photo?.alt_text ?? null,
      };
    });

    const { count } = await supabase
      .from("album_photos")
      .select("*", { count: "exact", head: true })
      .eq("album_id", albumData.id);

    let coverUrl: string | null = null;
    if (albumData.cover_path) {
      const { data: urlData } = supabase.storage
        .from("media")
        .getPublicUrl(albumData.cover_path);
      coverUrl = urlData.publicUrl;
    }

    return {
      id: albumData.id,
      slug: albumData.slug,
      title: albumData.title,
      description: albumData.description ?? null,
      coverUrl,
      location: albumData.location ?? null,
      dateFrom: albumData.date_from ?? null,
      dateTo: albumData.date_to ?? null,
      tags: albumData.tags || [],
      featured: albumData.featured,
      photoCount: count ?? photos.length,
      photos,
    };
  } catch (err) {
    console.error("Error in getAlbum:", err);
    return null;
  }
}
