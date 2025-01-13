// app/page.tsx
import { API_URL, POSTS_PER_PAGE, CATEGORY_ID } from '@/lib/constants';
import PostList from '@/components/PostList';
import { startOfDay, endOfDay, format, subDays } from 'date-fns';

// Función para obtener los posts iniciales
async function getInitialPosts() {
  const today = new Date();
  const adjustedDate = subDays(today, 1);
  const start = startOfDay(adjustedDate);
  const end = endOfDay(adjustedDate);

  const url = `${API_URL}/posts?_embed&per_page=${POSTS_PER_PAGE}&page=1&categories=${CATEGORY_ID}&after=${format(
    start,
    "yyyy-MM-dd'T'HH:mm:ss"
  )}&before=${format(end, "yyyy-MM-dd'T'HH:mm:ss")}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidate each hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching initial posts:', error);
    return [];
  }
}

export default async function Home() {
  const initialPosts = await getInitialPosts();

  return (
    <main className='bg-white min-h-screen'>
      <PostList initialPosts={initialPosts} />
    </main>
  );
}
