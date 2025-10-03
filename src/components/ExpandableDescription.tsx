'use client';

import { useState } from 'react';

interface ExpandableDescriptionProps {
  description: string;
  characterLimit?: number;
}

export default function ExpandableDescription({ 
  description, 
  characterLimit = 150 
}: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const shouldTruncate = description.length > characterLimit;
  const displayText = isExpanded || !shouldTruncate 
    ? description 
    : `${description.substring(0, characterLimit)}...`;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-900">Description</h3>
      <p className="text-sm text-slate-600 leading-relaxed">
        {displayText}
      </p>
      {shouldTruncate && (
        <button 
          className="text-sm text-[#1aa1aa] hover:underline"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'View less' : 'View more'}
        </button>
      )}
    </div>
  );
}
