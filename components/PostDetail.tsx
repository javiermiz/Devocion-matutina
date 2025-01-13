// components/PostDetail.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { API_URL } from '@/lib/constants';
import { processTitle, cleanContent } from '@/lib/content-utils';

interface Post {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
}

interface PostDetailProps {
  id: number;
  initialPost?: Post;
}

export default function PostDetail({ id, initialPost }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(initialPost || null);
  const [isLoading, setIsLoading] = useState(!initialPost);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialPost) {
      const fetchPost = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const response = await fetch(`${API_URL}/posts/${id}?_embed`);

          if (!response.ok) {
            throw new Error('Error fetching post');
          }

          const data = await response.json();
          const { title } = processTitle(data.title.rendered);
          data.content.rendered = cleanContent(data.content.rendered, title);
          setPost(data);
        } catch (error) {
          console.error('Error fetching post:', error);
          setError('Error cargando el contenido');
        } finally {
          setIsLoading(false);
        }
      };

      fetchPost();
    }
  }, [id, initialPost]);

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  if (isLoading) {
    return <div className='text-gray-500'>Cargando...</div>;
  }

  if (!post) return null;

  const { audience, title } = processTitle(post.title.rendered);

  return (
    <article className='container mx-auto max-w-2xl px-4 py-4 lg:py-16'>
      <header className='mb-12'>
        <div className='space-y-2'>
          <span className='text-sm text-gray-500'>{audience}</span>
          <h1 className='text-3xl lg:text-5xl font-bold tracking-tight'>
            {title}
          </h1>
        </div>
      </header>

      <div
        className='prose prose-lg max-w-none
                  prose-headings:font-medium prose-headings:tracking-tight
                  prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-4
                  prose-p:text-gray-600 prose-p:leading-relaxed prose-p:my-4
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-2 prose-blockquote:border-gray-200
                  prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-500
                  prose-strong:font-medium prose-strong:text-gray-900
                  prose-ul:my-6 prose-li:my-2
                  [&_iframe]:w-full'
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </article>
  );
}
