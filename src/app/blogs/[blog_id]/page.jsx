import LayoutMain from '@/layouts/main/LayoutMain';
import BlogDetail from './_components/BlogDetail';
import { BlogID } from '@/seo/Blogs';
import BlogsApiService from '@/api-services/api/BlogsApiService';

export async function generateMetadata({ params }) {
  const blog_id = params.blog_id;
  const blogID = await BlogsApiService.getBlogDetail(blog_id);

  const { title, canonical } = BlogID;
  const name = blogID.data.title;

  return {
    title: title(name),
    alternates: {
      canonical: canonical(blog_id),
    },
  };
}

export default async function DetailBlog({ params }) {
  const blog_id = params.blog_id;

  let initialDetailBlog = {
    title: '',
    date: '',
    content: '',
    author: '',
    imgUrl: '',
  };

  let initialRecentBlog = {
    recentBlogs: [],
  };

  const shuffleArray = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  try {
    const [blog, recentBlogsResult] = await Promise.all([
      BlogsApiService.getBlogDetail(blog_id),
      BlogsApiService.getAllBlogs(1, 20),
    ]);

    if (blog) {
      initialDetailBlog = {
        title: blog.data.title,
        date: blog.data.createdAt,
        content: blog.data.content,
        author: blog.data.author,
        imgUrl: blog.data.img,
      };
    }

    if (recentBlogsResult && recentBlogsResult.code == 0) {
      let sortedBlogs = recentBlogsResult.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      initialRecentBlog = {
        recentBlogs: shuffleArray(sortedBlogs).slice(0, 5),
      };
    }
  } catch (error) {
    console.error('Error fetch data', error);
  }

  return (
    <LayoutMain>
      <BlogDetail initialDetailBlog={initialDetailBlog} initialRecentBlog={initialRecentBlog} />
    </LayoutMain>
  );
}
