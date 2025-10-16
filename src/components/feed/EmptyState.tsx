import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function EmptyState() {
  return (
    <div className="text-center py-16">
      <Card className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mx-auto mb-6 flex items-center justify-center border-2 border-slate-300">
        <span className="text-2xl">🛍️</span>
      </Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        No products found
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Be the first to list a product on Sellexa and showcase your authentic African products!
      </p>
      <Button asChild className="bg-gradient-to-r from-[#1aa1aa] to-teal-600 hover:from-[#158a8f] hover:to-teal-700">
        <a href="/post">
          List a Product
        </a>
      </Button>
    </div>
  );
}
