import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, FileText, User, BarChart3, Users, Briefcase, Info, LayoutDashboard } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import data from './data.json';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSpeaker, setActiveSpeaker] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const stats = useMemo(() => {
    const total = data.length;
    const shareholders = new Set(data.map(item => item['Speaker Name'])).size;
    const finance = data.filter(item => item.Category === 'Finance').length;
    const general = data.filter(item => item.Category === 'General').length;
    return { total, shareholders, finance, general };
  }, []);

  const speakers = useMemo(() => {
    const filteredByCat = activeCategory === 'All' 
      ? data 
      : data.filter(item => item.Category === activeCategory);
    const uniqueSpeakers = Array.from(new Set(filteredByCat.map(item => item['Speaker Name'])));
    return ['All', ...uniqueSpeakers.sort()];
  }, [activeCategory]);

  // Reset speaker if it's not in the new filtered list
  React.useEffect(() => {
    if (activeSpeaker !== 'All' && !speakers.includes(activeSpeaker)) {
      setActiveSpeaker('All');
    }
  }, [speakers, activeSpeaker]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = 
        item.Question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item['Speaker Name'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        item['Short Summary'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        item['Summery'].toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = activeCategory === 'All' || item.Category === activeCategory;
      const matchesSpeaker = activeSpeaker === 'All' || item['Speaker Name'] === activeSpeaker;
      
      return matchesSearch && matchesCategory && matchesSpeaker;
    });
  }, [searchTerm, activeCategory, activeSpeaker]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans antialiased">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 z-50 hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex justify-center items-center ">
            <img src="/abbLogo.png" alt="ABB Logo" className="h-8 w-auto" />
            
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          <nav className="space-y-1">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 mb-2">Navigation</h3>
            <SidebarLink icon={<LayoutDashboard size={16} />} label="Overview" active />
          </nav>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-3">
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Speakers</h3>
              {activeSpeaker !== 'All' && (
                <button onClick={() => setActiveSpeaker('All')} className="text-[8px] font-black text-red-600 hover:underline">RESET</button>
              )}
            </div>
            <div className="space-y-0.5">
              {speakers.map((speaker) => (
                <button
                  key={speaker}
                  onClick={() => setActiveSpeaker(speaker)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between group",
                    activeSpeaker === speaker
                      ? "bg-red-50 text-red-600 shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <span className="truncate">{speaker}</span>
                  {activeSpeaker === speaker && <div className="w-1.5 h-1.5 rounded-full bg-red-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/50">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Status</span>
            </div>
            <p className="text-[10px] font-bold text-slate-600 leading-tight">Live AGM Data Feed Active — 2025</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-black tracking-tight text-slate-900 hidden sm:block">Executive Command Center</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-right hidden md:block">
              <div className="text-xs font-black text-slate-900">AGM 2025 SESSION</div>
              <div className="text-[9px] font-black text-slate-400 tracking-widest uppercase">ABB Limited India</div>
            </div>
            <div className="h-6 w-px bg-slate-200 mx-1" />
            <img src="/abbLogo.png" alt="ABB Logo" className="h-8 w-auto" />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1200px]">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-red-600 text-white text-[9px] font-black tracking-widest uppercase mb-3 ">
              Session Live
            </div>
            <h3 className="text-3xl lg:text-4xl font-black tracking-tighter text-slate-900 mb-2 leading-[1.1]">
              Shareholder Q&A Intelligence Dashboard
            </h3>
            <p className="text-slate-500 text-base max-w-xl font-medium leading-relaxed">
              Analyze shareholder concerns and executive responses in real-time. Powering informed leadership through data transparency.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard label="Total Q&A" value={stats.total} icon={<BarChart3 className="text-red-600" />} />
            <StatCard label="Speakers" value={stats.shareholders} icon={<Users className="text-slate-900" />} />
            <StatCard label="Finance" value={stats.finance} icon={<Briefcase className="text-blue-600" />} />
            <StatCard label="General" value={stats.general} icon={<Info className="text-emerald-600" />} />
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col xl:flex-row gap-4 mb-8 items-start xl:items-center justify-between">
            <div className="relative w-full xl:max-w-lg group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-600/5 focus:border-red-600/20 transition-all text-base placeholder:text-slate-300 font-medium shadow-sm"
                placeholder="Search queries, keywords, speakers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
              {['All', 'Finance', 'General'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border",
                    activeCategory === cat
                      ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-900"
                  )}
                >
                  {cat}
                </button>
              ))}
              <div className="ml-auto text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm">
                {filteredData.length} records
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredData.map((item, index) => (
              <div 
                key={index}
                className={cn(
                  "bg-white border rounded-[1.5rem] transition-all duration-500 overflow-hidden",
                  expandedId === index 
                    ? "border-red-600 shadow-[0_15px_45px_rgba(220,38,38,0.06)]" 
                    : "border-slate-200/60 shadow-sm hover:border-slate-300 hover:shadow-md"
                )}
              >
                <div className="p-6 lg:p-8 cursor-pointer" onClick={() => toggleExpand(index)}>
                  <div className="flex items-start gap-6">
                    <div className={cn(
                      "hidden sm:flex shrink-0 w-12 h-12 rounded-xl items-center justify-center transition-all duration-500 border",
                      expandedId === index ? "bg-red-600 text-white border-red-600" : "bg-slate-50 text-slate-400 border-slate-100"
                    )}>
                      <User className="h-5 w-5" />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black tracking-[0.2em] text-red-600 uppercase">{item['Speaker Name']}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className={cn(
                          "text-[9px] px-2.5 py-0.5 rounded-md font-black uppercase tracking-widest border",
                          item.Category === 'Finance' ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                        )}>
                          {item.Category}
                        </span>
                      </div>
                      <h4 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 leading-snug">{item.Question}</h4>
                      {expandedId !== index && (
                        <p className="text-slate-500 text-base leading-relaxed line-clamp-2 font-medium">{item['Short Summary']}</p>
                      )}
                    </div>

                    <div className={cn(
                      "shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border",
                      expandedId === index ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-200 border-slate-100"
                    )}>
                      {expandedId === index ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </div>
                </div>

                {expandedId === index && (
                  <div className="px-6 lg:px-8 pb-10 space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="h-px bg-slate-100 w-full" />
                    
                    <div className="flex flex-col gap-10">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Full Executive Summary</h5>
                          <p className="text-slate-700 text-lg lg:text-xl leading-relaxed font-bold italic border-l-4 border-red-600 pl-5">
                            "{item.Summery}"
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/60 shadow-sm w-fit min-w-[300px]">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-red-600">
                            <FileText size={20} />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Reference Source</span>
                            <span className="text-xs font-bold text-slate-800">{item.Source}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Key Strategic Insights</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {item['Detailed Points'].split('|').map((point, pIdx) => {
                            const [title, ...desc] = point.split('**');
                            return (
                              <div key={pIdx} className="bg-white p-5 lg:p-6 rounded-[1.5rem] border border-slate-200/80 shadow-sm hover:border-red-600/20 transition-all hover:-translate-y-1 duration-300 group/point">
                                {desc.length > 0 ? (
                                  <>
                                    <span className="text-slate-900 font-black text-xs block mb-2 uppercase tracking-tight group-hover/point:text-red-600 transition-colors">{title.trim()}</span>
                                    <p className="text-slate-500 text-xs lg:text-sm leading-relaxed font-medium">{desc.join('**').trim()}</p>
                                  </>
                                ) : (
                                  <p className="text-slate-800 text-xs lg:text-sm leading-relaxed font-bold">{point.trim()}</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-40 bg-white rounded-[4rem] border border-dashed border-slate-200">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Search className="h-12 w-12 text-slate-200" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-3">No Results Found</h3>
              <p className="text-slate-400 max-w-sm mx-auto font-medium">Refine your search parameters or adjust filters to explore other inquiries.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('All');
                  setActiveSpeaker('All');
                }}
                className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl"
              >
                Reset Dashboard
              </button>
            </div>
          )}
        </main>

        <footer className="py-12 border-t border-slate-200 text-center bg-white mt-auto">
          <p className="text-slate-400 text-[10px] font-black tracking-[0.4em] uppercase">
            © 2025 ABB INDIA LIMITED — INTERNAL LEADERSHIP COMMAND
          </p>
        </footer>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, label, active = false }) => (
  <button className={cn(
    "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all",
    active ? "bg-red-600 text-white shadow-lg shadow-red-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
  )}>
    {icon}
    <span>{label}</span>
  </button>
);

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white border border-slate-200/80 p-5 rounded-[1.5rem] flex flex-col justify-between shadow-sm hover:shadow-lg hover:border-slate-300 transition-all group">
    <div className="flex items-center justify-between mb-2">
      <div className="text-3xl font-black tracking-tighter text-slate-900 group-hover:scale-105 transition-transform duration-500">{value}</div>
      <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center transition-colors group-hover:bg-slate-100">
        {React.cloneElement(icon, { size: 18 })}
      </div>
    </div>
    <div className="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase">{label}</div>
  </div>
);

export default App;
