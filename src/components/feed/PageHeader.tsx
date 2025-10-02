interface PageHeaderProps {
  variant?: 'mobile' | 'desktop';
}

export default function PageHeader({ variant = 'mobile' }: PageHeaderProps) {
  const isMobile = variant === 'mobile';
  
  return (
    <div className="text-center mb-8">
      <h1 className={`font-bold text-gray-900 mb-2 ${isMobile ? 'text-2xl md:text-3xl' : 'text-3xl font-semibold mb-4'}`}>
        Discover African Products
      </h1>
      <p className={`text-gray-600 ${isMobile ? 'text-sm md:text-base' : 'text-sm max-w-2xl mx-auto'}`}>
        {isMobile 
          ? 'Curated collections from authentic African sellers'
          : 'Explore authentic African products from verified sellers across the continent'
        }
      </p>
      <div className={`bg-[#1aa1aa] mx-auto mt-4 rounded-full ${isMobile ? 'w-16 h-[1.5px]' : 'w-20 h-[1.5px] mt-6'}`}></div>
    </div>
  );
}
