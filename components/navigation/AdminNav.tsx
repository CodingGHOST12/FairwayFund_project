import Link from 'next/link';

export function AdminNav() {
  const navItems = [
    { href: '/admin', label: 'Overview' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/subscriptions', label: 'Subscriptions' },
    { href: '/admin/draws', label: 'Draws' },
    { href: '/admin/charities', label: 'Charities' },
    { href: '/admin/winners', label: 'Winners' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 mb-8">
      <div className="flex space-x-8 overflow-x-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="py-4 px-2 border-b-2 border-transparent hover:border-green-600 text-gray-600 hover:text-gray-900 whitespace-nowrap transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
