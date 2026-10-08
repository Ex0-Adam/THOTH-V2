import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Header from '@/frontend/components/Header';
import '@/frontend/styles/globals.css';

/**
 * Frontend Root Layout
 * 
 * Provides consistent structure across all frontend routes.
 * Includes professional metadata highlighting:
 * - GitHub Developer Program Member
 * - Google Workspace Certified Reseller
 */

export const metadata: Metadata = {
  title: {
    template: '%s | Micro Headless CMS',
    default: 'Micro Headless CMS — Enterprise Content Platform',
  },
  description:
    'A production-ready, API-first headless CMS built with Next.js 16, TypeScript, and PostgreSQL. Managed by GitHub Developer Program Member & Google Workspace Certified Reseller.',
  
  // Open Graph for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://micro-cms.example.com',
    siteName: 'Micro Headless CMS',
    title: 'Micro Headless CMS — Enterprise Content Platform',
    description:
      'A production-ready, API-first headless CMS by GitHub Developer Program Member',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Micro Headless CMS Platform',
        type: 'image/png',
      },
    ],
  },

  // Twitter Card for social sharing
  twitter: {
    card: 'summary_large_image',
    title: 'Micro Headless CMS',
    description: 'Enterprise-grade headless content management platform',
    creator: '@githubdevmember',
    images: ['/og-image.png'],
  },

  // Keywords for SEO
  keywords: [
    'headless CMS',
    'Next.js',
    'TypeScript',
    'PostgreSQL',
    'API-first',
    'content management',
    'enterprise CMS',
    'GitHub Developer',
    'Google Workspace',
  ],

  // Additional technical metadata
  authors: [
    {
      name: 'GitHub Developer Program Member',
      url: 'https://github.com',
    },
  ],
  
  creator: 'GitHub Developer Program Member',
  
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },

  // Verification tokens (add yours if deploying)
  verification: {
    google: 'verification-code-here', // Replace with actual verification code
  },

  // Viewport for responsive design
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },

  // Category
  category: 'Technology',
};

export default function FrontendLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Canonical URL */}
        <link
          rel="canonical"
          href={process.env.NEXT_PUBLIC_APP_URL || 'https://micro-cms.example.com'}
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Fonts */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Manifest for PWA */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme color */}
        <meta name="theme-color" content="#2563eb" />

        {/* Additional SEO */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased">
        <div className="flex flex-col min-h-screen bg-white">
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                
                {/* Brand Column */}
                <div>
                  <h3 className="text-white font-bold text-lg mb-4">
                    Micro CMS
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Enterprise-grade headless content management system.
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-block px-2 py-1 bg-gray-800 rounded text-gray-300">
                      GitHub Developer
                    </span>
                    <span className="inline-block px-2 py-1 bg-gray-800 rounded text-gray-300">
                      Google Workspace
                    </span>
                  </div>
                </div>

                {/* Product Links */}
                <div>
                  <h4 className="text-white font-semibold mb-4">Product</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                    <li><a href="/products" className="hover:text-white transition-colors">Products</a></li>
                    <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                    <li><a href="/admin" className="hover:text-white transition-colors">Admin Panel</a></li>
                  </ul>
                </div>

                {/* Documentation Links */}
                <div>
                  <h4 className="text-white font-semibold mb-4">Documentation</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub Repository</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Setup Guide</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                  </ul>
                </div>

                {/* Social & Legal Links */}
                <div>
                  <h4 className="text-white font-semibold mb-4">Connect</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                    <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  </ul>
                </div>
              </div>

              {/* Copyright */}
              <div className="border-t border-gray-800 pt-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="text-sm text-gray-400 mb-4 md:mb-0">
                    <p>© 2026 Micro Headless CMS. All rights reserved.</p>
                    <p className="mt-2">Built with ❤️ for the WebShardow ecosystem</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    <p>By GitHub Developer Program Member</p>
                    <p>Google Workspace Certified Reseller</p>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
