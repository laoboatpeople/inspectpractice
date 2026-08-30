'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
}

interface BlogFilterProps {
  posts: Post[];
  categories: string[];
  basePath: string;
}

export default function BlogFilter({ posts, categories, basePath }: BlogFilterProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const filteredPosts = useMemo(
    () =>
      activeCategory === categories[0]
        ? posts
        : posts.filter((p) => p.category === activeCategory),
    [activeCategory, posts, categories],
  );

  return (
    <>
      {/* Category Filter */}
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                activeCategory === cat
                  ? 'bg-[#176B87] text-white'
                  : 'bg-white/5 text-[#586A73] hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
              {cat !== categories[0] && (
                <span className="ml-1.5 opacity-60">
                  {posts.filter((p) => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-4xl mx-auto px-6 pb-24 space-y-6">
        {filteredPosts.map((post) => (
          <Link
            key={post.slug}
            href={`${basePath}/${post.slug}`}
            className="block p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#176B87]/30 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] font-medium text-[#176B87] bg-[#176B87]/10 px-2 py-1 rounded">
                {post.category}
              </span>
              <span className="text-xs text-[#7A8B94]">{post.date}</span>
              <span className="text-xs text-[#7A8B94]">· {post.readTime}</span>
            </div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-[#176B87] transition-colors">
              {post.title}
            </h2>
            <p className="text-sm text-[#586A73] leading-relaxed">
              {post.description}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
