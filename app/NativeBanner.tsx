'use client'; // ضروري لأننا نستخدم useEffect و DOM

import { useEffect, useRef } from 'react';

export default function NativeBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // نتحقق إذا كان السكريبت لم يُضف بعد لمنع تكراره
    if (containerRef.current && !containerRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.src = "https://pl29563026.effectivecpmnetwork.com/6af2b6818f392ef46f8642bca45bee94/invoke.js";
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      
      containerRef.current.appendChild(script);
    }
  }, []);

  // الحاوية التي حددها كود الإعلان
  return (
    <div 
      id="container-6af2b6818f392ef46f8642bca45bee94" 
      ref={containerRef}
      className="my-4 min-h-[100px]" // إضافة مسافة وتنسيق بسيط
    />
  );
}