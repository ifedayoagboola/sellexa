import Link from 'next/link';

interface LegalLinksProps {
  className?: string;
  showLabels?: boolean;
}

export default function LegalLinks({ className = '', showLabels = true }: LegalLinksProps) {
  const links = [
    { href: '/legal/terms', label: 'Terms of Service' },
    { href: '/legal/privacy', label: 'Privacy Policy' },
    { href: '/legal/cookies', label: 'Cookie Policy' },
    { href: '/legal/seller-agreement', label: 'Seller Agreement' },
    { href: '/legal/returns', label: 'Returns & Refunds' },
    { href: '/legal/prohibited', label: 'Prohibited Items' },
    { href: '/legal/dmca', label: 'DMCA Policy' },
  ];

  return (
    <div className={`flex flex-wrap gap-4 text-sm ${className}`}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-gray-600 hover:text-[#1aa1aa] transition-colors"
        >
          {showLabels ? link.label : link.label.split(' ')[0]}
        </Link>
      ))}
    </div>
  );
}
