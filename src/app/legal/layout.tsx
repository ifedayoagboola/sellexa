import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link 
            href="/feed" 
            className="inline-flex items-center text-[#1aa1aa] hover:text-[#158a8f] transition-colors mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Sellexa
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Legal & Compliance</h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex space-x-8 py-4">
            <Link href="/legal/terms" className="text-sm font-medium text-gray-700 hover:text-[#1aa1aa] transition-colors">
              Terms of Service
            </Link>
            <Link href="/legal/privacy" className="text-sm font-medium text-gray-700 hover:text-[#1aa1aa] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/legal/cookies" className="text-sm font-medium text-gray-700 hover:text-[#1aa1aa] transition-colors">
              Cookie Policy
            </Link>
            <Link href="/legal/seller-agreement" className="text-sm font-medium text-gray-700 hover:text-[#1aa1aa] transition-colors">
              Seller Agreement
            </Link>
            <Link href="/legal/returns" className="text-sm font-medium text-gray-700 hover:text-[#1aa1aa] transition-colors">
              Returns & Refunds
            </Link>
            <Link href="/legal/prohibited" className="text-sm font-medium text-gray-700 hover:text-[#1aa1aa] transition-colors">
              Prohibited Items
            </Link>
            <Link href="/legal/dmca" className="text-sm font-medium text-gray-700 hover:text-[#1aa1aa] transition-colors">
              DMCA Policy
            </Link>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
