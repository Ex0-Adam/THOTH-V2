'use client';

import Link from 'next/link';
import { Project } from '@/frontend/lib/api';

interface ProductCardProps {
  product: Project;
}

/**
 * Product Card Component
 * 
 * Reusable card component for displaying projects/products in grid/list layouts.
 * Used in Product Listing page.
 * Displays project metadata including title, description, thumbnail, and tools used.
 */

export default function ProductCard({ product }: ProductCardProps) {
  const thumbnailUrl =
    product.thumbnail || '/placeholder-project.png';

  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Product Image */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.toolsUsed && product.toolsUsed.length > 0 && (
          <div className="absolute top-3 right-3 inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
            {product.toolsUsed.length} tools
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>

        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
            {product.description}
          </p>
        )}

        {/* Tools Used */}
        {product.toolsUsed && product.toolsUsed.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {product.toolsUsed.slice(0, 3).map((tool, idx) => (
                <span
                  key={idx}
                  className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium"
                >
                  {tool}
                </span>
              ))}
              {product.toolsUsed.length > 3 && (
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">
                  +{product.toolsUsed.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pt-3 border-t border-gray-100">
          <span>ID: {product.id.slice(0, 8)}...</span>
          {product.date && (
            <span>
              {new Date(product.date).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {product.projectUrl && (
            <a
              href={product.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              View Project
            </a>
          )}
          {product.videoLink && (
            <a
              href={product.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
