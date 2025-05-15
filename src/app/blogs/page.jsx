import LayoutMain from '@/layouts/main/LayoutMain';
import ListBlogs from './_components/Blogs';
import { BlogDetail } from '@/seo/Blogs';
import { landingPage } from '@/seo/LandingPage';
import BlogsApiService from '@/api-services/api/BlogsApiService';

const { canonical } = landingPage;
const { title } = BlogDetail;

export const metadata = {
  title: title,
  alternates: {
    canonical: `${canonical}blogs`,
  },
};

export default async function Blogs() {
  let initialDataBlogs = {
    data: [],
    total: 0,
  };

  try {
    const result = await BlogsApiService.getAllBlogs(1, 9);
    if (result && result.code == 0) {
      initialDataBlogs = {
        data: result.data,
        total: result.total_app,
      };
    }
  } catch (error) {
    console.error('Error fetch data', error);
  }

  return (
    <LayoutMain>
      <ListBlogs initialDataBlogs={initialDataBlogs} />
    </LayoutMain>
  );
}
