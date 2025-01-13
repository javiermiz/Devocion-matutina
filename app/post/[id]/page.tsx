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
    const cleanedContent = cleanContent(post.content.rendered, title);

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

        <PostDetail post={post} cleanedContent={cleanedContent} />
      </main>
    );
  } catch (error) {
    console.log(error);

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

        <div className='container mx-auto max-w-2xl px-4 py-4 lg:py-16'>
          <div className='text-red-500'>Error cargando el contenido</div>
        </div>
      </main>
    );
  }
}
