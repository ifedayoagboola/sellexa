import { createClient } from '@/integrations/supabase/server';
import { redirect } from 'next/navigation';
import UserMenu from '@/components/UserMenu';
import Navigation from '@/components/Navigation';

export default async function NotificationsPage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  // Mock notifications data - in real app, this would come from Supabase
  const notifications = [
    {
      id: '1',
      type: 'save',
      message: 'Someone saved your post',
      product: {
        title: 'Fresh Garri',
        image: '/placeholder.jpg'
      },
      user: {
        name: 'Aisha',
        avatar: null
      },
      timestamp: '2m ago',
      read: false
    },
    {
      id: '2',
      type: 'restock',
      message: 'Product you saved is now Restocking',
      product: {
        title: 'Ankara Fabric',
        image: '/placeholder.jpg'
      },
      user: {
        name: 'Kwame',
        avatar: null
      },
      timestamp: '1h ago',
      read: false
    },
    {
      id: '3',
      type: 'new_product',
      message: 'New product near you: Yam Flour',
      product: {
        title: 'Yam Flour',
        image: '/placeholder.jpg'
      },
      user: {
        name: 'Fatima',
        avatar: null
      },
      timestamp: '3h ago',
      read: true
    },
    {
      id: '4',
      type: 'message',
      message: 'New message from Aisha about Fresh Garri',
      product: {
        title: 'Fresh Garri',
        image: '/placeholder.jpg'
      },
      user: {
        name: 'Aisha',
        avatar: null
      },
      timestamp: '5h ago',
      read: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'save':
        return '❤️';
      case 'restock':
        return '📦';
      case 'new_product':
        return '🆕';
      case 'message':
        return '💬';
      default:
        return '🔔';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          <UserMenu user={user} />
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-7xl mx-auto">
        {notifications.length > 0 ? (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-muted/50 transition-colors ${
                  !notification.read ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className="text-2xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      {notification.message}
                    </p>
                    
                    {/* Product Info */}
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        <span className="text-xs">📦</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground truncate">
                          {notification.product.title}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.timestamp}
                    </p>
                  </div>
                  
                  {/* Unread Indicator */}
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5v-5a10 10 0 1 1 20 0v5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No notifications yet</h2>
            <p className="text-muted-foreground">
              You'll see updates about your posts and saved items here
            </p>
          </div>
        )}
      </div>
      
      <Navigation />
    </div>
  );
}
