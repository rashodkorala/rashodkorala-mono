import { MetadataRoute } from 'next';
import { getAlbums } from './actions/albums';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://photos.rashodkorala.com';
  const currentDate = new Date();

  const albums = await getAlbums();
  const albumEntries: MetadataRoute.Sitemap = albums.map((album) => ({
    url: `${baseUrl}/albums/${album.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#gallery`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/albums`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...albumEntries,
  ];
}

