// app/posts/[id]/page.tsx
import { API_URL } from '@/lib/constants';
import PostDetail from '@/components/PostDetail';
import { processTitle, cleanContent } from '@/lib/content-utils';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function Post({ params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${API_URL}/posts/${params.id}?_embed`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }

    const post = await response.json();
    const { title } = processTitle(post.title.rendered);

    // Procesar el contenido en el servidor
    post.content.rendered = cleanContent(post.content.rendered, title);

    return (
      <main className='bg-white min-h-screen'>
        <header className='bg-white border-b border-gray-200'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='h-16 flex items-center'>
              <Link
                href='/'
                className='flex items-center text-gray-600 hover:text-gray-900 transition-colors'
              >
                <ArrowLeft className='h-5 w-5 mr-2' />
                <span className='font-medium'>Volver</span>
              </Link>
            </div>
          </div>
        </header>

        <PostDetail initialPost={post} id={parseInt(params.id)} />
      </main>
    );
  } catch (error) {
    console.error('Error fetching initial post:', error);
    return (
      <main className='bg-white min-h-screen'>
        <header className='bg-white border-b border-gray-200'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='h-16 flex items-center'>
              <Link
                href='/'
                className='flex items-center text-gray-600 hover:text-gray-900 transition-colors'
              >
                <ArrowLeft className='h-5 w-5 mr-2' />
                <span className='font-medium'>Volver</span>
              </Link>
            </div>
          </div>
        </header>

        <PostDetail id={parseInt(params.id)} />
      </main>
    );
  }
}
