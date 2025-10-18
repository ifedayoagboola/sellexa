import { redirect } from 'next/navigation';

// Redirect /seller to signup page since landing page has all seller info
export default function SellerPage() {
  redirect('/auth/signup');
}
