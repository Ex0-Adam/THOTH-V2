'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CredentialsBadgeCompact } from './CredentialsBadge';

/**
 * Frontend Header Component
 * 
 * Professional header with integrated credentials and navigation.
 * Follows UI Standards from FRONTEND_STANDARD.md:
 * - Centralized branding and navigation
 * - Professional credentials integration
 * - Serves both public frontend and as reference for backend UI consistency
 */

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

function HeaderNavLink({ href, label, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`relative px-3 py-2 text-sm font-semibold transition-all tracking-tight group ${
        isActive
          ? 'text-blue-600'
          : 'text-gray-700 hover:text-gray-900'
      }`}
    >
      {label}
      <span
        className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all ${
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Brand with Credentials */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2.5 hover:opacity-80 transition-opacity">
              <div className="relative w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">MC</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div className="hidden sm:block">
                <span className="block text-sm font-bold text-gray-900">Micro CMS</span>
                <span className="block text-xs text-gray-500">Headless Platform</span>
              </div>
            </Link>

            {/* Professional Credentials Badge */}
            <div className="hidden lg:block pl-4 border-l border-gray-200">
              <CredentialsBadgeCompact />
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <HeaderNavLink
              href="/"
              label="Home"
              isActive={isActive('/')}
            />
            <HeaderNavLink
              href="/products"
              label="Products"
              isActive={isActive('/products')}
            />
            <HeaderNavLink
              href="/dashboard"
              label="Dashboard"
              isActive={isActive('/dashboard')}
            />
          </nav>

          {/* Admin & Auth Actions */}
          <div className="flex items-center space-x-4">
            {/* Toggle for credentials on smaller screens */}
            <div className="lg:hidden">
              <CredentialsBadgeCompact />
            </div>

            <Link
              href="/admin"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              title="Admin Dashboard"
            >
              admin
            </Link>
            
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
