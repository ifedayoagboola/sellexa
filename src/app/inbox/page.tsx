import { createClient } from '@/integrations/supabase/server';
import { redirect } from 'next/navigation';
import UserMenu from '@/components/UserMenu';
import Navigation from '@/components/Navigation';

export default async function InboxPage() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  // Mock conversation data - in real app, this would come from Supabase
  const conversations = [
    {
      id: '1',
      product: {
        id: 'prod-1',
        title: 'Fresh Garri',
        price_pence: 500,
        image: '/placeholder.jpg'
      },
      user: {
        name: 'Aisha',
        handle: 'aisha_foods',
        avatar: null
      },
      lastMessage: 'Is this still available?',
      timestamp: '2m ago',
      unread: true
    },
    {
      id: '2',
      product: {
        id: 'prod-2',
        title: 'Ankara Fabric',
        price_pence: 2500,
        image: '/placeholder.jpg'
      },
      user: {
        name: 'Kwame',
        handle: 'kwame_fashion',
        avatar: null
      },
      lastMessage: 'Thanks for the quick delivery!',
      timestamp: '1h ago',
      unread: false
    },
    {
      id: '3',
      product: {
        id: 'prod-3',
        title: 'Shea Butter',
        price_pence: 800,
        image: '/placeholder.jpg'
      },
      user: {
        name: 'Fatima',
        handle: 'fatima_beauty',
        avatar: null
      },
      lastMessage: 'Available ✅',
      timestamp: '3h ago',
      unread: true
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">Inbox</h1>
          <UserMenu user={user} />
        </div>
      </div>

      {/* Conversations List */}
      <div className="max-w-7xl mx-auto">
        {conversations.length > 0 ? (
          <div className="divide-y divide-border">
            {conversations.map((conversation) => (
              <div key={conversation.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0">
                    {conversation.user.name.charAt(0)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-foreground truncate">
                        {conversation.user.name}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {conversation.timestamp}
                      </span>
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        <span className="text-xs">📦</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.product.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          £{(conversation.product.price_pence / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Last Message */}
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${conversation.unread ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No conversations yet</h2>
            <p className="text-muted-foreground">
              Start chatting with sellers about products you're interested in
            </p>
          </div>
        )}
      </div>
      
      <Navigation />
    </div>
  );
}