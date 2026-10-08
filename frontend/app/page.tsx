import Header from '@/frontend/components/Header';
import Link from 'next/link';

/**
 * Frontend Home Page
 * 
 * Main landing page for the public frontend.
 * Located at: /
 */

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Welcome to Micro Headless CMS
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                A modern, scalable content management system built for the WebShardow ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                >
                  Browse Products
                </Link>
                <Link
                  href="/dashboard"
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                >
                  View Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Powerful Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              
              {/* Feature 1 */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  API-First
                </h3>
                <p className="text-gray-600">
                  RESTful API design that decouples content from presentation for maximum flexibility.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Fully Configurable
                </h3>
                <p className="text-gray-600">
                  Customize every aspect of your CMS through environment variables and configuration files.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Multi-Platform
                </h3>
                <p className="text-gray-600">
                  Deploy on Vercel, Docker, or any Node.js-compatible platform with zero code changes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Modern Tech Stack
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: 'Next.js 16', desc: 'React framework with App Router' },
                { name: 'TypeScript', desc: 'Type-safe development' },
                { name: 'Tailwind CSS', desc: 'Modern utility-first styling' },
                { name: 'PostgreSQL', desc: 'Reliable database' },
                { name: 'Prisma ORM', desc: 'Database access layer' },
                { name: 'Vercel Deploy', desc: 'Serverless deployment' },
                { name: 'REST API', desc: 'Standard API architecture' },
                { name: 'Docker Ready', desc: 'Container support' },
              ].map((tech, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <h4 className="font-bold text-gray-900 mb-2">{tech.name}</h4>
                  <p className="text-sm text-gray-600">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Start exploring our catalog or access the admin panel to manage your content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Browse Products
              </Link>
              <Link
                href="/admin"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors border border-blue-400"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
