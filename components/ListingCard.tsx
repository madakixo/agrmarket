
import React from 'react';
import { MapPin, Calendar, ShoppingCart, User } from 'lucide-react';
import { ProduceListing } from '../types';

interface ListingCardProps {
  listing: ProduceListing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={listing.images[0]} 
          alt={listing.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 shadow-sm">
          {listing.category_name}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{listing.title}</h3>
          <span className="text-emerald-600 font-bold">${listing.price_per_unit.toFixed(2)}<span className="text-xs text-slate-400 font-normal">/{listing.unit}</span></span>
        </div>
        
        <p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10">
          {listing.description}
        </p>
        
        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 mr-1.5" />
            <span className="truncate">{listing.location_name} {listing.market_name ? `(${listing.market_name})` : ''}</span>
          </div>
          <div className="flex items-center text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            <span>Harvest: {new Date(listing.harvest_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-xs text-slate-400">
            <User className="w-3.5 h-3.5 mr-1.5" />
            <span className="truncate">Seller: {listing.seller_name}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
            Stock: {listing.quantity_available} {listing.unit}s
          </span>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl transition-colors shadow-sm active:scale-95">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
