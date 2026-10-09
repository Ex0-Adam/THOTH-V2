import { Suspense } from 'react';
import Link from 'next/link';
import Header from '@/frontend/components/Header';
import { Dashboard, ApiResponse, DashboardStats } from '@/frontend/lib/api';

/**
 * Dashboard Page
 * 
 * Shows analytics and overview of system statistics.
 * Located at: /dashboard
 * Data fetched through: frontend/lib/api.ts
 */

async function DashboardContent() {
  let stats: DashboardStats | null = null;
  let error: string | null = null;

  try {
    const response = await Dashboard.getStats() as ApiResponse<DashboardStats>;
    if (response.success && response.data) {
      stats = response.data;
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load dashboard';
  }

  return (
    <main className="flex-1 bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Overview of your content management system
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            <p className="font-medium">Unable to load dashboard</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {stats && (
          <div className="space-y-8">
            
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Total Products Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Total Products
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.totalProducts}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Projects Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Total Projects
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.totalProjects}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Staff Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Team Members
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.totalStaffMembers}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 12H9m4 0h4m-10 8h12a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* System Status Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      System Status
                    </p>
                    <p className="text-lg font-bold text-green-600 mt-2">
                      ✓ Operational
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <svg
                      className="w-6 h-6 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/admin/products"
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
                >
                  Manage Products
                </Link>
                <Link
                  href="/admin/projects"
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
                >
                  Manage Projects
                </Link>
                <Link
                  href="/admin"
                  className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-center"
                >
                  Go to Admin
                </Link>
              </div>
            </div>

            {/* Information Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Welcome to Micro Headless CMS
              </h3>
              <p className="text-blue-800">
                This is your central dashboard for managing content across the WebShardow ecosystem.
                Use the navigation menu to access different modules or visit the Admin Console for
                detailed content management.
              </p>
            </div>
          </div>
        )}

        {!stats && !error && (
          <div className="text-center py-12 text-gray-500">
            <p>Loading dashboard...</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<DashboardLoadingSkeleton />}>
        <DashboardContent />
      </Suspense>
    </>
  );
}

function DashboardLoadingSkeleton() {
  return (
    <main className="flex-1 bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="h-10 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-96 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-10 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
