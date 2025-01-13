'use client';
// components/PostList.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL, POSTS_PER_PAGE, CATEGORY_ID } from '@/lib/constants';
import { DatePicker } from './Calendar';
import { format, startOfDay, endOfDay, subDays } from 'date-fns';

interface Post {
  id: number;
  title: { rendered: string };
  date: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      media_details: {
        sizes: {
          medium: {
            source_url: string;
          };
        };
      };
    }>;
  };
}

interface ProcessedTitle {
  audience: string;
  title: string;
}

interface PostListProps {
  initialPosts: Post[];
}

export default function PostList({ initialPosts }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    startOfDay(new Date())
  );

  const processTitle = (fullTitle: string): ProcessedTitle => {
    const match = fullTitle.match(/Matutina para ([^2]+) 2025 \| (.+)$/);
    if (match) {
      return {
        audience: match[1].trim(),
        title: match[2].trim(),
      };
    }
    return {
      audience: '',
      title: fullTitle,
    };
  };

  const fetchPosts = async (pageNum: number, date?: Date) => {
    setLoading(true);
    try {
      let url = `${API_URL}/posts?_embed&per_page=${POSTS_PER_PAGE}&page=${pageNum}&categories=${CATEGORY_ID}`;

      if (date) {
        const adjustedDate = subDays(date, 1);
        const start = startOfDay(adjustedDate);
        const end = endOfDay(adjustedDate);
        url += `&after=${format(
          start,
          "yyyy-MM-dd'T'HH:mm:ss"
        )}&before=${format(end, "yyyy-MM-dd'T'HH:mm:ss")}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Error fetching posts');

      const data = await response.json();
      setPosts(pageNum === 1 ? data : (prevPosts) => [...prevPosts, ...data]);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Solo fetcheamos si la fecha seleccionada es diferente a la inicial
    const currentDate = format(selectedDate, 'yyyy-MM-dd');
    const initialDate = format(startOfDay(new Date()), 'yyyy-MM-dd');

    if (currentDate !== initialDate) {
      fetchPosts(1, selectedDate);
    }
  }, [selectedDate]);

  const loadMore = () => {
    fetchPosts(page + 1, selectedDate);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date ? startOfDay(date) : startOfDay(new Date()));
    setPage(1);
  };

  return (
    <div className='container mx-auto px-4 py-12 max-w-6xl'>
      {/* ===== Header Section ===== */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8 mb-12'>
        <div className='space-y-1'>
          <h1 className='text-3xl lg:text-5xl font-bold tracking-tight'>
            Devocionales
          </h1>
          <p className='text-sm text-gray-500'>
            Selecciona una fecha para ver las devocionales disponibles
          </p>
        </div>
        <div className='w-full md:w-auto'>
          <DatePicker onSelect={handleDateSelect} />
        </div>
      </div>

      {/* ===== Grid Section ===== */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {posts.map((post) => {
          const { audience, title } = processTitle(post.title.rendered);
          return (
            <Link href={`/post/${post.id}`} key={post.id} className='group'>
              <div className='aspect-video relative overflow-hidden rounded-xl'>
                <Image
                  src={
                    post._embedded?.['wp:featuredmedia']?.[0]?.media_details
                      .sizes.medium.source_url || '/placeholder.svg'
                  }
                  alt={title}
                  layout='fill'
                  objectFit='cover'
                  className='transition-transform duration-300 group-hover:scale-102'
                />
              </div>
              <div className='mt-4'>
                <span className='text-sm text-gray-600 mb-1 block'>
                  {audience}
                </span>
                <h2 className='text-lg text-gray-900 group-hover:text-gray-600 transition-colors'>
                  {title}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ===== Load More Button ===== */}
      {posts.length >= POSTS_PER_PAGE && (
        <div className='mt-12 text-center'>
          <button
            onClick={loadMore}
            disabled={loading}
            className='px-8 py-2 border border-gray-300 rounded text-gray-700 hover:border-gray-400 disabled:opacity-50 transition-colors'
          >
            {loading ? 'Cargando...' : 'Cargar más'}
          </button>
        </div>
      )}
    </div>
  );
}
