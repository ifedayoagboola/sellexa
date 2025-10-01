'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  PlusIcon, 
  ChatBubbleLeftRightIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid, 
  MagnifyingGlassIcon as MagnifyingGlassIconSolid, 
  PlusIcon as PlusIconSolid, 
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid, 
  UserIcon as UserIconSolid 
} from '@heroicons/react/24/solid';

const navigation = [
  { name: 'Feed', href: '/feed', icon: HomeIcon, iconSolid: HomeIconSolid },
  { name: 'Search', href: '/search', icon: MagnifyingGlassIcon, iconSolid: MagnifyingGlassIconSolid },
  { name: 'Post', href: '/post', icon: PlusIcon, iconSolid: PlusIconSolid },
  { name: 'Inbox', href: '/inbox', icon: ChatBubbleLeftRightIcon, iconSolid: ChatBubbleLeftRightIconSolid },
  { name: 'Profile', href: '/profile', icon: UserIcon, iconSolid: UserIconSolid },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center py-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === '/feed' && pathname === '/feed') ||
            (item.href === '/profile' && pathname.startsWith('/profile'));
          
          const IconComponent = isActive ? item.iconSolid : item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <IconComponent className="h-6 w-6" />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
