import Link from 'next/link';
import { 
  Sparkles, CheckCircle2, ArrowRight, ShieldCheck, 
  HelpCircle, Eye, RefreshCw, Smartphone, Award, Terminal 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-warm-bg flex flex-col justify-between selection:bg-indigo-100">
      {/* Navigation */}
      <header className="py-5 px-6 md:px-12 border-b border-warm-border bg-white/70 backdrop-blur-md flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white">
            <Sparkles size={16} className="text-amber-500" />
          </div>
          <span className="font-sans font-bold text-lg tracking-tight text-primary">CareerForge</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs font-semibold text-primary hover:underline">
            Sign In
          </Link>
          <Link
            href="/register"
            className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-light transition-colors shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 md:px-12 py-16 md:py-28 text-center max-w-4xl mx-auto space-y-6">
        <span className="text-[10px] uppercase font-bold tracking-widest text-brand px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 inline-flex items-center gap-1">
          <Sparkles size={11} className="text-amber-500" />
          Modern Career Package Engineering
        </span>
        <h1 className="text-4xl md:text-6xl font-serif font-semibold text-primary tracking-tight leading-tight">
          Engineering Your Professional Identity Package
        </h1>
        <p className="text-base md:text-lg text-primary-light max-w-xl mx-auto leading-relaxed">
          We turn your raw career details and internships into a premium, recruiter-vetted resume layout, a dynamic web portfolio, and tailored interview kits. Meticulously designed. Zero buzzwords.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 py-3 px-8 rounded-xl font-bold text-white bg-primary hover:bg-primary-light transition-all shadow-sm cursor-pointer"
          >
            Build Your Professional Identity
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 py-3 px-8 rounded-xl font-semibold text-primary border border-warm-border bg-white hover:bg-warm-bg transition-all cursor-pointer"
          >
            Explore Live Demo
          </Link>
        </div>
      </section>

      {/* Interactive Feature: Before vs After Resume Bullet Wording */}
      <section className="px-6 md:px-12 py-16 bg-white border-y border-warm-border">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-primary">
              Recruiter-Vetted Content Enhancement
            </h2>
            <p className="text-xs text-primary-light">
              We replace weak descriptions and empty AI buzzword stuffing with quantified, achievement-focused milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="border border-warm-border p-6 rounded-2xl bg-warm-bg/40 space-y-4">
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                Generic Bullet Points
              </span>
              <ul className="space-y-3 text-xs text-primary-light pl-4 list-disc leading-relaxed">
                <li>Responsible for editing code on the dashboard portal application.</li>
                <li>Helped design standard Figma components for the team design systems.</li>
                <li>Completed reports on logistics regional routing databases.</li>
              </ul>
            </div>

            {/* After */}
            <div className="border border-indigo-200 p-6 rounded-2xl bg-indigo-50/20 space-y-4 shadow-3xs">
              <span className="text-[10px] font-bold text-brand uppercase tracking-wider block flex items-center gap-1">
                <CheckCircle2 size={12} className="text-emerald-500" />
                CareerForge Quantified Wording
              </span>
              <ul className="space-y-3 text-xs text-primary pl-4 list-disc leading-relaxed">
                <li>Refactored legacy portal dashboard to Next.js App Router, cutting bundle sizes by 40% and increasing FCP loads by 25%.</li>
                <li>Built modular WCAG-compliant Figma design tokens, saving developers roughly 4-6 hours per product sprint cycle.</li>
                <li>Evaluated regional pipeline databases to cut transit routes, saving an estimated 15% in logistics travel mileage.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase Grid */}
      <section className="px-6 md:px-12 py-16 md:py-24 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-primary">
            Dynamic Web Portfolios
          </h2>
          <p className="text-xs text-primary-light">
            Dynamic layouts matching your category style. Fully customizable and responsive out-of-the-box.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Modern Developer', desc: 'Chronological timeline, dynamic project cards, clean technical tags.', icon: Terminal },
            { title: 'Corporate Professional', desc: 'Serif headings, high-end margins, resume-first credentials layout.', icon: Award },
            { title: 'Creative Designer', desc: 'Design showcases, visual grids, spacious interactive layouts.', icon: Smartphone },
          ].map((tpl, idx) => {
            const Icon = tpl.icon;
            return (
              <div key={idx} className="border border-warm-border p-6 rounded-2xl bg-white shadow-3xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-warm-bg border border-warm-border flex items-center justify-center text-primary mb-4">
                    <Icon size={16} />
                  </div>
                  <h4 className="font-semibold text-sm text-primary">{tpl.title}</h4>
                  <p className="text-xs text-primary-light mt-2 leading-relaxed">
                    {tpl.desc}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-warm-border/50 text-[10px] font-bold text-brand uppercase tracking-wider">
                  Template Included
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Simple Pricing System */}
      <section className="px-6 md:px-12 py-16 bg-white border-t border-warm-border">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-primary">
              Simple, Career-Vetted Pricing
            </h2>
            <p className="text-xs text-primary-light">
              Accelerate your placement chances with verified assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Free */}
            <div className="border border-warm-border p-6 rounded-2xl bg-warm-bg/20 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-primary text-sm">Free Basic Tier</h4>
                <div className="text-xl font-bold text-primary mt-2">$0</div>
                <p className="text-[10px] text-primary-light mt-1">Perfect to experience the parser.</p>
                <ul className="mt-5 space-y-2.5 text-xs text-primary-light">
                  <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Basic resume parsing</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> 1 Portfolio Template</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Limited resume editing</li>
                </ul>
              </div>
              <Link
                href="/register"
                className="w-full text-center py-2.5 mt-6 border border-warm-border rounded-xl text-xs font-semibold text-primary hover:bg-warm-bg transition-colors"
              >
                Sign Up
              </Link>
            </div>

            {/* Premium */}
            <div className="border border-primary p-6 rounded-2xl bg-white shadow-xs flex flex-col justify-between ring-1 ring-primary">
              <div>
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-primary text-sm">Premium Transformation</h4>
                  <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    RECOMMENDED
                  </span>
                </div>
                <div className="text-xl font-bold text-primary mt-2">$29</div>
                <p className="text-[10px] text-primary-light mt-1">Full professional identity suite.</p>
                <ul className="mt-5 space-y-2.5 text-xs text-primary">
                  <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Unlimited resume enhancements</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> 3 High-end portfolio templates</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Print-ready PDF file exports</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> 10 Tailored Interview Flashcards</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Watermark removal & Custom branding</li>
                </ul>
              </div>
              <Link
                href="/register"
                className="w-full text-center py-2.5 mt-6 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-light transition-colors"
              >
                Go Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-12 py-16 md:py-24 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-primary">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-primary-light">
            Everything you need to know about CareerForge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          <div className="p-5 border border-warm-border rounded-xl bg-white space-y-2">
            <h4 className="font-bold text-primary flex items-center gap-1">
              <ShieldCheck size={12} className="text-brand" />
              Do you guarantee a 98% ATS score?
            </h4>
            <p className="text-primary-light">
              No, and we actively advise avoiding platforms that do. Recruiters evaluate candidates based on authentic experiences and clear structure, not automated keyword stuffing. We focus on readable, recruiter-approved styling and impact-focused wording.
            </p>
          </div>
          <div className="p-5 border border-warm-border rounded-xl bg-white space-y-2">
            <h4 className="font-bold text-primary flex items-center gap-1">
              <RefreshCw size={12} className="text-brand" />
              How does the resume verification step work?
            </h4>
            <p className="text-primary-light">
              We never blindly trust AI parsing results. Once you upload your credentials, CareerForge presents a fully editable structured form. You have absolute control to verify, refine, or add context before any assets or portfolios are generated.
            </p>
          </div>
          <div className="p-5 border border-warm-border rounded-xl bg-white space-y-2">
            <h4 className="font-bold text-primary flex items-center gap-1">
              <Eye size={12} className="text-brand" />
              Can I customize my portfolio sections?
            </h4>
            <p className="text-primary-light">
              Absolutely. Through your central configurator dashboard, you can switch between Developer, Corporate, or Creative templates instantly, and toggle the public visibility of individual sections (such as Certifications, Projects, or Achievements) in one click.
            </p>
          </div>
          <div className="p-5 border border-warm-border rounded-xl bg-white space-y-2">
            <h4 className="font-bold text-primary flex items-center gap-1">
              <HelpCircle size={12} className="text-brand" />
              How are the interview prep questions contextualized?
            </h4>
            <p className="text-primary-light">
              Unlike generic questionnaires, our AI model parses your verified work accomplishments and individual project descriptions. It generates 5 highly specific technical architecture/tradeoff questions and 5 custom-tailored behavioral scenario flashcards.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-warm-border bg-white text-center text-xs text-primary-light">
        <p>&copy; {new Date().getFullYear()} CareerForge. Engineered for ambitious professionals.</p>
      </footer>
    </div>
  );
}
