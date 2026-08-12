"use client";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

export default function MiniCard({ 
  title = "Aurora Modern Residence", 
  location = "Beverly Hills, CA 90210", 
  buttonText = "Explore",
  href = "#" 
}) {
  return (
    <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl text-white">
      
      {/* Top Section */}
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 bg-black/30 px-3 py-1 rounded-full inline-block mb-3">
          Featured Property
        </span>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <div className="flex items-center gap-2 text-gray-300">
          <MapPin size={16} className="text-amber-400" />
          <span className="text-sm">{location}</span>
        </div>
      </div>

      {/* Action Button */}
      <Link 
        href={href}
        className="group flex items-center justify-between w-full bg-amber-500 hover:bg-amber-400 transition-colors text-black font-semibold py-3 px-5 rounded-xl"
      >
        {buttonText}
        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </Link>
      
    </div>
  );
}