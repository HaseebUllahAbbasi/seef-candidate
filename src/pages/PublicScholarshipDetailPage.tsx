import PublicLayout from '../components/PublicLayout';
import AdvertisementDetailPage from './AdvertisementDetailPage';

export default function PublicScholarshipDetailPage() {
  return (
    <PublicLayout>
      <AdvertisementDetailPage publicMode />
    </PublicLayout>
  );
}
