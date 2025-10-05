'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  StarIcon, 
  HeartIcon, 
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  EnvelopeIcon,
  CheckBadgeIcon,
  SparklesIcon,
  ShoppingBagIcon,
  PencilIcon,
  ChartBarIcon,
  CogIcon,
  PlusIcon,
  EyeIcon,
  TrashIcon,
  ArrowRightIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface ProfilePageClientProps {
  user: any;
  profile: any;
  products: any[];
}

export default function ProfilePageClient({ user, profile, products }: ProfilePageClientProps) {
  const router = useRouter();
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [showProductManager, setShowProductManager] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);

  const handleEditProfile = () => {
    if (profile?.kyc_status === 'verified') {
      // For verified sellers, go to KYC form to update business info
      router.push('/kyc');
    } else {
      // TODO: Implement general profile edit functionality
      alert('Edit profile functionality coming soon!');
    }
  };

  const handleApplyVerification = () => {
    router.push('/kyc');
  };

  const handleSellerPage = () => {
    if (profile?.handle) {
      router.push(`/seller/${profile.handle}`);
    } else {
      alert('Please complete your seller verification to access your seller page.');
      router.push('/kyc');
    }
  };

  const handleCreateProduct = () => {
    router.push('/post');
  };

  const handleManageProducts = () => {
    setShowProductManager(true);
  };

  const handleEditProduct = (productId: string) => {
    // Navigate to dedicated edit product page
    router.push(`/edit-product/${productId}`);
  };

  const handleDeleteProduct = (product: any) => {
    setProductToDelete(product);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete.id)
        .eq('user_id', user.id); // Ensure user can only delete their own products

      if (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
        return;
      }

      // Success - refresh the page to show updated product list
      window.location.reload();
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const formatPrice = (pricePence: number) => {
    return `£${(pricePence / 100).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'SOLD':
        return 'bg-red-100 text-red-800';
      case 'RESTOCKING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to construct image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Construct the full Supabase storage URL with correct bucket name
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return supabaseUrl ? `${supabaseUrl}/storage/v1/object/public/product-images/${imagePath}` : null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 pt-48 lg:pt-56">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="w-20 h-20 bg-[#1aa1aa] rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {user.user_metadata?.full_name || 'User'}
                  </h1>
                  <p className="text-gray-600 mb-2">@{user.email?.split('@')[0] || 'user'}</p>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {profile?.city || 'Location not set'}
                      {profile?.postcode && `, ${profile.postcode}`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {profile?.kyc_status === 'verified' ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                      <CheckBadgeIcon className="h-4 w-4 mr-1" />
                      Verified Seller
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center">
                      <SparklesIcon className="h-4 w-4 mr-1" />
                      Buyer Account
                    </span>
                  )}
                  <Button
                    onClick={handleEditProfile}
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    {profile?.kyc_status === 'verified' ? 'Edit Business' : 'Edit Profile'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Account Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-[#1aa1aa]" />
                Account Overview
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900 flex items-center">
                    <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Member Since</label>
                  <p className="text-gray-900 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {user.created_at ? formatDate(user.created_at) : 'Unknown'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Account Type</label>
                  <p className="text-gray-900">
                    {profile?.kyc_status === 'verified' ? 'Verified Seller' : 'Buyer Account'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CogIcon className="h-5 w-5 mr-2 text-[#1aa1aa]" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  onClick={() => setShowSavedModal(true)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <HeartIcon className="h-4 w-4 mr-2" />
                  Saved Products
                </Button>
                {profile?.kyc_status !== 'verified' && (
                  <Button
                    onClick={handleApplyVerification}
                    className="w-full justify-start bg-[#1aa1aa] hover:bg-[#158a8f]"
                  >
                    <ShieldCheckIcon className="h-4 w-4 mr-2" />
                    Apply for Verification
                  </Button>
                )}
                <Button
                  onClick={handleCreateProduct}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Product
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sales Dashboard */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ChartBarIcon className="h-5 w-5 mr-2 text-[#1aa1aa]" />
                  Sales Dashboard
                </h3>
                <Button
                  onClick={() => setShowDashboardModal(true)}
                  variant="outline"
                  size="sm"
                >
                  View Details
                </Button>
              </div>
              {profile?.kyc_status === 'verified' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                    <p className="text-sm text-gray-600">Products</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-600">Sales</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">£0</p>
                    <p className="text-sm text-gray-600">Revenue</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-600">Views</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ChartBarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">
                    Complete seller verification to access your sales dashboard
                  </p>
                  <Button
                    onClick={handleApplyVerification}
                    className="bg-[#1aa1aa] hover:bg-[#158a8f]"
                  >
                    Apply for Verification
                  </Button>
                </div>
              )}
            </div>

            {/* Product Management */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <ShoppingBagIcon className="h-5 w-5 mr-2 text-[#1aa1aa]" />
                  Product Management
                </h3>
                    <Button
                      onClick={handleCreateProduct}
                      size="sm"
                      className="bg-[#1aa1aa] hover:bg-[#158a8f]"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      New Product
                    </Button>
              </div>
              {profile?.kyc_status === 'verified' ? (
                products.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <ShoppingBagIcon className="h-8 w-8 text-[#1aa1aa] mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Active Products</p>
                          <p className="text-sm text-gray-600">{products.length} products listed</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        onClick={handleManageProducts}
                        variant="outline"
                        className="flex items-center justify-center"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View All Products
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBagIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">
                      You haven't created any products yet
                    </p>
                    <Button
                      onClick={handleCreateProduct}
                      className="bg-[#1aa1aa] hover:bg-[#158a8f]"
                    >
                      Create Your First Product
                    </Button>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <ShieldCheckIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">
                    Complete seller verification to manage products
                  </p>
                  <Button
                    onClick={handleApplyVerification}
                    className="bg-[#1aa1aa] hover:bg-[#158a8f]"
                  >
                    Apply for Verification
                  </Button>
                </div>
              )}
            </div>

            {/* Business Information */}
            {profile?.business_name && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ShoppingBagIcon className="h-5 w-5 mr-2 text-[#1aa1aa]" />
                  Business Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Business Name</label>
                    <p className="text-gray-900">{profile.business_name}</p>
                  </div>
                  {profile.business_whatsapp && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">WhatsApp Business</label>
                      <p className="text-gray-900">{profile.business_whatsapp}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Verification Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      profile.kyc_status === 'verified' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {profile.kyc_status === 'verified' ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved Coming Soon Modal */}
      <Dialog open={showSavedModal} onOpenChange={setShowSavedModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle>Coming Soon!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-[#1aa1aa]/10 rounded-full flex items-center justify-center">
                <HeartIcon className="h-8 w-8 text-[#1aa1aa]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Saved Products Coming Soon!</h3>
                <DialogDescription className="text-sm text-gray-600 leading-relaxed">
                  We're working hard to bring you the ability to save and organize your favorite products! 
                  In the meantime, use the <strong>Save</strong> button on product pages to bookmark items.
                </DialogDescription>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-500">
                  Stay tuned for updates on our saved collections feature! ❤️
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowSavedModal(false)}
                className="flex-1"
              >
                Got it!
              </Button>
              <Button
                onClick={() => router.push('/feed')}
                className="flex-1 bg-[#1aa1aa] hover:bg-[#158a8f]"
              >
                Browse Products
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sales Dashboard Coming Soon Modal */}
      <Dialog open={showDashboardModal} onOpenChange={setShowDashboardModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle>Coming Soon!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-[#1aa1aa]/10 rounded-full flex items-center justify-center">
                <ChartBarIcon className="h-8 w-8 text-[#1aa1aa]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Advanced Dashboard Coming Soon!</h3>
                <DialogDescription className="text-sm text-gray-600 leading-relaxed">
                  We're working hard to bring you detailed analytics, sales insights, and performance metrics! 
                  The full dashboard will include advanced charts, customer insights, and revenue tracking.
                </DialogDescription>
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-500">
                  Stay tuned for updates on our comprehensive analytics dashboard! 📊
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowDashboardModal(false)}
                className="flex-1"
              >
                Got it!
              </Button>
              <Button
                onClick={handleSellerPage}
                className="flex-1 bg-[#1aa1aa] hover:bg-[#158a8f]"
              >
                View Seller Page
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Management Modal */}
      <Dialog open={showProductManager} onOpenChange={setShowProductManager}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ShoppingBagIcon className="h-5 w-5 mr-2 text-[#1aa1aa]" />
              Manage Products
            </DialogTitle>
            <DialogDescription>
              View, edit, and delete your products. Add new products to expand your catalog.
            </DialogDescription>
          </DialogHeader>
          
          {/* Add Product Button */}
          <div className="flex justify-end mb-4">
            <Button
              onClick={handleCreateProduct}
              size="sm"
              className="bg-[#1aa1aa] hover:bg-[#158a8f]"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Product
            </Button>
          </div>
          
          {products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={getImageUrl(product.images[0]) || ''}
                            alt={product.title}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) {
                                fallback.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ display: (product.images && product.images.length > 0) ? 'none' : 'flex' }}
                        >
                          <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{product.title}</h4>
                        <p className="text-sm text-gray-600">{formatPrice(product.price_pence)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                            {product.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            Created {formatDate(product.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditProduct(product.id)}
                        variant="outline"
                        size="sm"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteProduct(product)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBagIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No products found</p>
              <Button
                onClick={handleCreateProduct}
                className="bg-[#1aa1aa] hover:bg-[#158a8f]"
              >
                Create Your First Product
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Product Confirmation Modal */}
      <Dialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete <strong>"{productToDelete?.title}"</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setProductToDelete(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteProduct}
                variant="destructive"
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Navigation />
    </div>
  );
}
