import Dashboard from "@/components/dashboard";
import { getPhotos } from "@/lib/actions/photos";
import { getAnalyticsSummary } from "@/lib/actions/analytics";

export default async function Page() {
  const [photos, analytics] = await Promise.all([
    getPhotos().catch(() => []),
    getAnalyticsSummary().catch(() => null),
  ]);

  return (
    <Dashboard
      photosCount={photos.length}
      analytics={analytics}
    />
  );
}