
import React, { useState, useEffect } from 'react';
import { AppRoute, ProduceListing, Category } from './types';
import { MOCK_LISTINGS, CATEGORIES, getIcon } from './constants';
import Navigation from './components/Navigation';
import ListingCard from './components/ListingCard';
import { generateListingDetails, getMarketAdvice } from './services/geminiService';
// Added Search to the imports from lucide-react
import { Sparkles, ArrowRight, Send, Loader2, RefreshCw, X, Search } from 'lucide-react';

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>(AppRoute.HOME);
  const [listings, setListings] = useState<ProduceListing[]>(MOCK_LISTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Listing creation state
  const [newListing, setNewListing] = useState({
    title: '',
    category: '',
    price: '',
    unit: 'kg',
    quantity: '',
    harvestDate: new Date().toISOString().split('T')[0]
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  // AI Advisor state
  const [advisorQuery, setAdvisorQuery] = useState('');
  const [advisorResponse, setAdvisorResponse] = useState('');
  const [isAdvisorLoading, setIsAdvisorLoading] = useState(false);

  const filteredListings = listings.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? l.category_id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleGenerateAI = async () => {
    if (!newListing.title || !newListing.category) {
      alert("Please enter a title and category first");
      return;
    }
    setIsGenerating(true);
    try {
      const data = await generateListingDetails(newListing.title, newListing.category);
      setAiSuggestions(data);
    } catch (error) {
      console.error(error);
      alert("Error generating details. Check console.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const listing: ProduceListing = {
      id: Date.now(),
      seller_id: 1,
      seller_name: "You (Demo Farmer)",
      category_id: CATEGORIES.find(c => c.name === newListing.category)?.id || 1,
      category_name: newListing.category,
      title: newListing.title,
      description: aiSuggestions?.description || `Fresh ${newListing.title} from our farm.`,
      price_per_unit: parseFloat(newListing.price),
      unit: newListing.unit,
      quantity_available: parseFloat(newListing.quantity),
      location_name: "My Local Farm",
      images: ["https://picsum.photos/seed/newlisting/800/600"],
      harvest_date: newListing.harvestDate,
      created_at: new Date().toISOString(),
    };
    setListings([listing, ...listings]);
    setRoute(AppRoute.LISTINGS);
    // Reset
    setNewListing({ title: '', category: '', price: '', unit: 'kg', quantity: '', harvestDate: new Date().toISOString().split('T')[0] });
    setAiSuggestions(null);
  };

  const handleAdvisorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisorQuery) return;
    setIsAdvisorLoading(true);
    try {
      const resp = await getMarketAdvice(advisorQuery);
      setAdvisorResponse(resp || "No response received.");
    } catch (err) {
      console.error(err);
      setAdvisorResponse("Failed to get advice. Check your configuration.");
    } finally {
      setIsAdvisorLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16">
      <Navigation currentRoute={route} setRoute={setRoute} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {route === AppRoute.HOME && (
          <div className="space-y-12 animate-in fade-in duration-500">
            {/* Hero */}
            <section className="relative rounded-3xl overflow-hidden bg-emerald-900 text-white p-8 md:p-16">
              <div className="relative z-10 max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Connecting Farmers Directly to Your Table.
                </h1>
                <p className="text-emerald-100 text-lg mb-8 opacity-90">
                  Buy fresh produce straight from local growers. Transparent pricing, better for farmers, better for you.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => setRoute(AppRoute.LISTINGS)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-lg shadow-emerald-900/40 flex items-center"
                  >
                    Start Shopping <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setRoute(AppRoute.CREATE)}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold py-3 px-8 rounded-2xl transition-all"
                  >
                    Sell Your Produce
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block opacity-40">
                <img src="https://picsum.photos/seed/farmhero/1200/800" className="w-full h-full object-cover rounded-l-[100px]" alt="Hero background" />
              </div>
            </section>

            {/* Categories */}
            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Browse Categories</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setRoute(AppRoute.LISTINGS); }}
                    className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col items-center justify-center space-y-3 hover:border-emerald-500 hover:shadow-md transition-all group"
                  >
                    <div className="p-3 rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      {getIcon(cat.icon)}
                    </div>
                    <span className="font-semibold text-slate-700">{cat.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Featured */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Fresh Near You</h2>
                  <p className="text-slate-500">Directly from regional farms</p>
                </div>
                <button 
                  onClick={() => setRoute(AppRoute.LISTINGS)}
                  className="text-emerald-600 font-semibold hover:underline flex items-center"
                >
                  View All <ArrowRight className="ml-1 w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.slice(0, 3).map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
            </section>
          </div>
        )}

        {route === AppRoute.LISTINGS && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-slate-800">Marketplace</h1>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search tomatoes, grains, organic..." 
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`px-5 py-2 rounded-full whitespace-nowrap border transition-all ${!selectedCategory ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
              >
                All Items
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2 rounded-full whitespace-nowrap border transition-all ${selectedCategory === cat.id ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredListings.map(l => <ListingCard key={l.id} listing={l} />)}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No produce found</h3>
                <p className="text-slate-500 mb-6">Try adjusting your filters or search terms</p>
                <button 
                  onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
                  className="text-emerald-600 font-semibold hover:bg-emerald-50 px-6 py-2 rounded-xl transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {route === AppRoute.CREATE && (
          <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-500">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-emerald-600 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <h1 className="text-3xl font-bold mb-2">List Your Produce</h1>
                <p className="text-emerald-100 opacity-90">Reach thousands of buyers directly from your farm.</p>
              </div>

              <form onSubmit={handleCreateListing} className="p-8 space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Listing Title</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Fresh Red Jubilee Watermelons" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={newListing.title}
                      onChange={(e) => setNewListing({...newListing, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Category</label>
                    <select 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                      value={newListing.category}
                      onChange={(e) => setNewListing({...newListing, category: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                      <span>AI Smart Description</span>
                    </div>
                    <button 
                      type="button"
                      disabled={isGenerating || !newListing.title || !newListing.category}
                      onClick={handleGenerateAI}
                      className="text-xs font-bold text-emerald-600 bg-white border border-emerald-200 px-3 py-2 rounded-lg hover:bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isGenerating ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-2" />}
                      {aiSuggestions ? 'Regenerate' : 'Generate AI Description'}
                    </button>
                  </div>

                  {aiSuggestions ? (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <p className="text-slate-600 text-sm italic leading-relaxed bg-white p-4 rounded-xl border border-emerald-100">
                        "{aiSuggestions.description}"
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {aiSuggestions.marketingKeywords?.map((k: string) => (
                          <span key={k} className="bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">#{k}</span>
                        ))}
                      </div>
                      <div className="text-xs text-emerald-800 font-semibold bg-emerald-100/50 px-3 py-2 rounded-lg inline-block">
                        💡 Suggested Price: {aiSuggestions.suggestedPriceRange}
                      </div>
                    </div>
                  ) : (
                    <p className="text-emerald-600/60 text-sm text-center py-4 italic">
                      Fill in Title and Category to generate a professional listing description automatically.
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Price per Unit</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                      <input 
                        required
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={newListing.price}
                        onChange={(e) => setNewListing({...newListing, price: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Unit Type</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                      value={newListing.unit}
                      onChange={(e) => setNewListing({...newListing, unit: e.target.value})}
                    >
                      <option value="kg">Per Kilogram (kg)</option>
                      <option value="crate">Crate</option>
                      <option value="bag">Bag</option>
                      <option value="box">Box</option>
                      <option value="dozen">Dozen</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Quantity Available</label>
                    <input 
                      required
                      type="number" 
                      placeholder="e.g. 100" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={newListing.quantity}
                      onChange={(e) => setNewListing({...newListing, quantity: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Harvest Date</label>
                    <input 
                      required
                      type="date" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                      value={newListing.harvestDate}
                      onChange={(e) => setNewListing({...newListing, harvestDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Product Photos</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-slate-50">
                      <p className="text-xs text-slate-500">Tap to upload photos of your harvest</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-200 active:scale-[0.99]"
                  >
                    Post Listing to Market
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {route === AppRoute.AI_ADVISOR && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="bg-emerald-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="max-w-md">
                  <div className="flex items-center space-x-2 bg-emerald-800/50 backdrop-blur w-fit px-3 py-1 rounded-full text-emerald-300 text-xs font-bold mb-4 border border-emerald-700">
                    <Sparkles className="w-3 h-3" />
                    <span>SMART AGRI-ADVISOR</span>
                  </div>
                  <h1 className="text-4xl font-bold mb-4">Farmer Support AI</h1>
                  <p className="text-emerald-100/80 leading-relaxed">
                    Ask anything about market trends, crop diseases, fertilizer recommendations, or harvest timing.
                  </p>
                </div>
                <div className="bg-emerald-800/40 p-6 rounded-3xl backdrop-blur-md border border-emerald-700 flex-1">
                  <form onSubmit={handleAdvisorSubmit} className="space-y-4">
                    <textarea 
                      required
                      placeholder="e.g. What is the best time to plant cassava in Riverside County? How can I protect my tomatoes from early blight?"
                      className="w-full bg-emerald-950/50 border border-emerald-700 rounded-2xl p-4 text-white placeholder-emerald-700 focus:ring-2 focus:ring-emerald-500 outline-none h-32 resize-none"
                      value={advisorQuery}
                      onChange={(e) => setAdvisorQuery(e.target.value)}
                    />
                    <button 
                      type="submit"
                      disabled={isAdvisorLoading}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center"
                    >
                      {isAdvisorLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                      Get Expert Advice
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {advisorResponse && (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
                <button 
                  onClick={() => setAdvisorResponse('')}
                  className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-2xl flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-800">Agri-Advisor Analysis</h3>
                    <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {advisorResponse}
                    </div>
                    <div className="pt-6 flex flex-wrap gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 px-3 py-1 rounded-full">AI Insight</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 px-3 py-1 rounded-full">Farmer Direct</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid md:grid-cols-3 gap-4">
               {[
                 "How to improve soil nitrogen naturally?",
                 "Wholesale tomato prices in Lagos today",
                 "Pest control for organic cabbage"
               ].map(q => (
                 <button 
                  key={q}
                  onClick={() => setAdvisorQuery(q)}
                  className="bg-white border border-slate-200 p-4 rounded-2xl text-left hover:border-emerald-500 transition-all text-slate-600 text-sm font-medium flex items-center justify-between group"
                 >
                   <span>{q}</span>
                   <ArrowRight className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                 </button>
               ))}
            </div>
          </div>
        )}

        {route === AppRoute.PROFILE && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
             <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <img src="https://picsum.photos/seed/farmeruser/300/300" className="w-full h-full rounded-full object-cover border-4 border-emerald-50 shadow-xl" />
                  <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full border-4 border-white">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-slate-800 mb-1">Samuel Adeboye</h1>
                <p className="text-emerald-600 font-medium mb-6">Certified Organic Farmer • Member since 2023</p>
                <div className="grid grid-cols-3 gap-4 border-y border-slate-100 py-6 mb-8">
                  <div>
                    <div className="text-2xl font-bold text-slate-800">42</div>
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Listings</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800">4.9</div>
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800">1.2k</div>
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Sales</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-colors">Edit Profile</button>
                  <button className="w-full bg-white border border-slate-200 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-colors">Order History</button>
                  <button className="w-full text-red-500 font-bold py-4 rounded-2xl hover:bg-red-50 transition-colors mt-4">Sign Out</button>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
