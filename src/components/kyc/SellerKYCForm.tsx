'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  Instagram, 
  Twitter, 
  Facebook,
  Upload,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface KYCData {
  business_name: string;
  business_description: string;
  business_address: string;
  business_city: string;
  business_country: string;
  business_phone: string;
  business_website: string;
  business_instagram: string;
  business_twitter: string;
  business_facebook: string;
}

interface SellerKYCFormProps {
  onComplete: (success: boolean) => void;
  onCancel: () => void;
  initialData?: Partial<KYCData>;
}

export default function SellerKYCForm({ onComplete, onCancel, initialData }: SellerKYCFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<KYCData>({
    business_name: initialData?.business_name || '',
    business_description: initialData?.business_description || '',
    business_address: initialData?.business_address || '',
    business_city: initialData?.business_city || '',
    business_country: initialData?.business_country || '',
    business_phone: initialData?.business_phone || '',
    business_website: initialData?.business_website || '',
    business_instagram: initialData?.business_instagram || '',
    business_twitter: initialData?.business_twitter || '',
    business_facebook: initialData?.business_facebook || '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (field: keyof KYCData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `business-logos/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) {
        return null;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Upload logo if provided
      let logoUrl = null;
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile);
        if (!logoUrl) {
          setError('Failed to upload logo. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      // Update profile with KYC data
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to submit KYC information');
        setIsSubmitting(false);
        return;
      }

      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          handle: user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`,
          business_name: formData.business_name,
          business_description: formData.business_description,
          business_address: formData.business_address,
          business_city: formData.business_city,
          business_country: formData.business_country,
          business_phone: formData.business_phone,
          business_website: formData.business_website,
          business_instagram: formData.business_instagram,
          business_twitter: formData.business_twitter,
          business_facebook: formData.business_facebook,
          business_logo_url: logoUrl,
          kyc_status: 'verified',
          kyc_submitted_at: now,
          kyc_verified_at: now
        } as any);

      if (updateError) {
        setError(`Failed to submit KYC information: ${updateError.message || 'Please try again.'}`);
        setIsSubmitting(false);
        return;
      }

      setIsSuccess(true);
      setIsSubmitting(false);
      
      toast({
        title: "Verification Successful!",
        description: "Your business has been verified. You can now start selling!",
      });
      
      setTimeout(() => {
        onCancel();
        onComplete(true);
      }, 1500);
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.business_name.trim() && 
                     formData.business_description.trim() && 
                     formData.business_city.trim() && 
                     formData.business_country.trim();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#1aa1aa]/10 rounded-lg">
                <Building2 className="h-6 w-6 text-[#1aa1aa]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Seller Verification</h2>
                <p className="text-sm text-gray-600">Complete your business profile to start selling</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Success Message */}
          {isSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">
                Verification successful! Redirecting to create your first post...
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && !isSuccess && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                <span>Business Information</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name *
                  </label>
                  <Input
                    value={formData.business_name}
                    onChange={(e) => handleInputChange('business_name', e.target.value)}
                    placeholder="Enter your business name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Phone
                  </label>
                  <Input
                    value={formData.business_phone}
                    onChange={(e) => handleInputChange('business_phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    type="tel"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Description *
                </label>
                <textarea
                  value={formData.business_description}
                  onChange={(e) => handleInputChange('business_description', e.target.value)}
                  placeholder="Tell us about your business..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  required
                />
              </div>

              {/* Business Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Logo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">Upload Logo</span>
                    </label>
                  </div>
                  {logoPreview && (
                    <div className="relative">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: Square image, max 5MB
                </p>
              </div>
            </div>

            {/* Business Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-purple-600" />
                <span>Business Address</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <Input
                    value={formData.business_city}
                    onChange={(e) => handleInputChange('business_city', e.target.value)}
                    placeholder="Enter city"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <Input
                    value={formData.business_country}
                    onChange={(e) => handleInputChange('business_country', e.target.value)}
                    placeholder="Enter country"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Address
                </label>
                <Input
                  value={formData.business_address}
                  onChange={(e) => handleInputChange('business_address', e.target.value)}
                  placeholder="Street address, postal code, etc."
                />
              </div>
            </div>

            {/* Social Media & Website */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Globe className="h-5 w-5 text-purple-600" />
                <span>Online Presence</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <Input
                    value={formData.business_website}
                    onChange={(e) => handleInputChange('business_website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                    type="url"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram
                  </label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.business_instagram}
                      onChange={(e) => handleInputChange('business_instagram', e.target.value)}
                      placeholder="@username"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter
                  </label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.business_twitter}
                      onChange={(e) => handleInputChange('business_twitter', e.target.value)}
                      placeholder="@username"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook
                  </label>
                  <div className="relative">
                    <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={formData.business_facebook}
                      onChange={(e) => handleInputChange('business_facebook', e.target.value)}
                      placeholder="Page name or URL"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-900">Instant Verification</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your account will be verified immediately upon submission. You'll be able to create product listings right away!
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Submit for Verification</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
