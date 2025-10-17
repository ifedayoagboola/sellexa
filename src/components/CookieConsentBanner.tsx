'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Cookie, Settings } from 'lucide-react';
import Link from 'next/link';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
    }
  }, []);

  const savePreferences = (newPreferences: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setPreferences(newPreferences);
    setShowBanner(false);
    setShowPreferences(false);
    
    // Apply preferences to actual cookies
    applyCookiePreferences(newPreferences);
  };

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Essential cookies are always enabled
    if (prefs.analytics) {
      // Enable Google Analytics or other analytics tools
      console.log('Analytics cookies enabled');
    }
    
    if (prefs.marketing) {
      // Enable marketing cookies
      console.log('Marketing cookies enabled');
    }
    
    if (prefs.preferences) {
      // Enable preference cookies
      console.log('Preference cookies enabled');
    }
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    savePreferences(allAccepted);
  };

  const handleRejectNonEssential = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    savePreferences(essentialOnly);
  };

  const handleSaveCustomPreferences = () => {
    savePreferences(preferences);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg max-w-none">
      <div className="max-w-7xl mx-auto p-4">
        {!showPreferences ? (
          <Alert className="border-[#1aa1aa] bg-[#1aa1aa]/5">
            <Cookie className="h-4 w-4 text-[#1aa1aa]" />
            <AlertDescription className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <p className="text-gray-700">
                    We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. 
                    By continuing to use our site, you consent to our use of cookies.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Learn more in our{' '}
                    <Link href="/legal/cookies" className="text-[#1aa1aa] hover:text-[#158a8f] underline">
                      Cookie Policy
                    </Link>
                    {' '}and{' '}
                    <Link href="/legal/privacy" className="text-[#1aa1aa] hover:text-[#158a8f] underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreferences(true)}
                    className="text-sm"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Customize
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRejectNonEssential}
                    className="text-sm"
                  >
                    Reject Non-Essential
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                    className="bg-[#1aa1aa] hover:bg-[#158a8f] text-sm"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Cookie Preferences</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreferences(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Essential Cookies</h4>
                    <p className="text-sm text-gray-600">Required for basic website functionality</p>
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                    Always Active
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Analytics Cookies</h4>
                  <p className="text-sm text-gray-600">Help us understand how you use our website</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1aa1aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1aa1aa]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Marketing Cookies</h4>
                  <p className="text-sm text-gray-600">Used to deliver relevant advertisements</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1aa1aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1aa1aa]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Preference Cookies</h4>
                  <p className="text-sm text-gray-600">Remember your settings and preferences</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.preferences}
                    onChange={(e) => setPreferences(prev => ({ ...prev, preferences: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#1aa1aa]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1aa1aa]"></div>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowPreferences(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveCustomPreferences}
                className="bg-[#1aa1aa] hover:bg-[#158a8f]"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
