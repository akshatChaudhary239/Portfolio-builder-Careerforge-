'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowRight } from 'lucide-react';

const TwitterIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const LinkedinIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--color-v2-bg)] pt-20 pb-10 border-t border-[var(--color-v2-border)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 group mb-6">
              <div className="w-8 h-8 relative overflow-hidden rounded-lg bg-white shadow-sm border border-[var(--color-v2-border)]">
                <Image src="/images/getprospectra_logo.png" alt="GetProspectra Logo" fill className="object-cover" />
              </div>
              <span className="font-serif font-bold text-xl tracking-tight text-[var(--color-v2-text-primary)]">
                GetProspectra
              </span>
            </Link>
            <p className="text-sm text-[var(--color-v2-text-secondary)] mb-8 max-w-sm leading-relaxed">
              Engineered for ambitious professionals. We transform your career history into a powerful identity that gets you hired.
            </p>
            <div className="flex items-center gap-4 text-[var(--color-v2-text-secondary)]">
              <a href="#" className="w-10 h-10 rounded-full border border-[var(--color-v2-border)] flex items-center justify-center hover:bg-[var(--color-v2-primary)] hover:text-white hover:border-[var(--color-v2-primary)] transition-colors">
                <LinkedinIcon size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[var(--color-v2-border)] flex items-center justify-center hover:bg-[var(--color-v2-primary)] hover:text-white hover:border-[var(--color-v2-primary)] transition-colors">
                <TwitterIcon size={18} />
              </a>
              <a href="mailto:hello@getprospectra.com" className="w-10 h-10 rounded-full border border-[var(--color-v2-border)] flex items-center justify-center hover:bg-[var(--color-v2-primary)] hover:text-white hover:border-[var(--color-v2-primary)] transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold text-[var(--color-v2-text-primary)] mb-6 text-sm">Product</h4>
            <ul className="space-y-4 text-sm text-[var(--color-v2-text-secondary)]">
              <li><Link href="#how-it-works" className="hover:text-[var(--color-v2-primary)] transition-colors">How It Works</Link></li>
              <li><Link href="#features" className="hover:text-[var(--color-v2-primary)] transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-[var(--color-v2-primary)] transition-colors">Pricing</Link></li>
              <li><Link href="#portfolio-showcase" className="hover:text-[var(--color-v2-primary)] transition-colors">Showcase</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[var(--color-v2-text-primary)] mb-6 text-sm">Resources</h4>
            <ul className="space-y-4 text-sm text-[var(--color-v2-text-secondary)]">
              <li><Link href="#" className="hover:text-[var(--color-v2-primary)] transition-colors">Blog</Link></li>
              <li><Link href="#faq" className="hover:text-[var(--color-v2-primary)] transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-[var(--color-v2-primary)] transition-colors">Templates</Link></li>
              <li><Link href="#" className="hover:text-[var(--color-v2-primary)] transition-colors">Career Guides</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-bold text-[var(--color-v2-text-primary)] mb-6 text-sm">Stay Updated</h4>
            <p className="text-xs text-[var(--color-v2-text-secondary)] mb-4">Get career tips and updates.</p>
            <div className="flex items-center">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-2.5 rounded-l-lg border border-r-0 border-[var(--color-v2-border)] bg-white text-sm focus:outline-none focus:border-[var(--color-v2-primary)]"
              />
              <button className="px-4 py-2.5 rounded-r-lg bg-[var(--color-v2-border)] text-[var(--color-v2-text-secondary)] hover:bg-[var(--color-v2-primary)] hover:text-white transition-colors border border-l-0 border-[var(--color-v2-border)] hover:border-[var(--color-v2-primary)]">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
          
        </div>

        <div className="pt-8 border-t border-[var(--color-v2-border)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--color-v2-text-secondary)]">
          <p>&copy; {new Date().getFullYear()} GetProspectra. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-[var(--color-v2-primary)]">Privacy Policy</Link>
            <Link href="#" className="hover:text-[var(--color-v2-primary)]">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
