import { Suspense } from 'react';
import Header from '@/frontend/components/Header';
import ErrorBoundary from '@/frontend/components/ErrorBoundary';
import EmptyState from '@/frontend/components/EmptyState';
import ProductCard from '@/frontend/components/ProductCard';
import { Projects, Project } from '@/frontend/lib/api';

/**
 * Product Listing Page
 * 
 * Displays all projects/products from the backend API.
 * Located at: /products
 * Data fetched through: frontend/lib/api.ts
 * 
 * Features:
 * - Error boundary for graceful error handling
 * - Loading states with suspense
 * - Empty state handling
 * - Professional error recovery UI
 */

async function ProductsContent() {
  let projects: Project[] = [];
  let error: string | null = null;
  let errorDetails: string | null = null;

  try {
    const response = await Projects.getAll();
    if (Array.isArray(response)) {
      projects = response;
    } else if (response && !Array.isArray(response)) {
      projects = [];
      error = 'Unexpected response format';
    }
  } catch (err) {
    error = 'Unable to load products. Please try again later.';
    errorDetails = err instanceof Error ? err.message : 'Unknown error';
    console.error('Failed to fetch products:', err);
  }

  return (
    <main className="flex-1 bg-gradient-to-b from-gray-50 to-white">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Product Catalog
            </h1>
            <p className="text-lg text-gray-600">
              Explore our comprehensive collection of projects and solutions. Each product represents our expertise in modern development practices.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Error State */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4v2m-6-4a9 9 0 1118 0 9 9 0 01-18 0z"
                />
              </svg>
              <div className="ml-4">
                <h3 className="text-sm font-semibold text-red-800">
                  {error}
                </h3>
                {errorDetails && (
                  <p className="mt-2 text-sm text-red-700">
                    {errorDetails}
                  </p>
                )}
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && projects.length === 0 && (
          <div className="my-12">
            <EmptyState
              icon="folder"
              title="No products yet"
              description="Check back soon as we add more products to our catalog."
              action={{
                label: 'Back to Home',
                href: '/',
              }}
            />
          </div>
        )}

        {/* Products Grid */}
        {projects.length > 0 && (
          <div>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Product Count
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {projects.length}
                </p>
              </div>
              <div className="text-right text-sm text-gray-500">
                Showing all products
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProductCard key={project.id} product={project} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <ErrorBoundary>
      <Header />
      <Suspense fallback={<ProductsLoadingSkeleton />}>
        <ProductsContent />
      </Suspense>
    </ErrorBoundary>
  );
}

function ProductsLoadingSkeleton() {
  return (
    <main className="flex-1 bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-10 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-96 animate-pulse" />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg animate-pulse">
              <div className="w-full h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
