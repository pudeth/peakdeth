'use client'

import { useState } from 'react'
import {
  Smartphone,
  Wifi,
  Battery,
  ShoppingBag,
  Search,
  Home,
  Compass,
  Bell,
  User,
  Sparkles,
  CheckCircle2,
  Plus
} from 'lucide-react'

export default function MobileAppDemo() {
  const [activeTab, setActiveTab] = useState('home')
  const [cartCount, setCartCount] = useState(2)
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'POS Apps', 'E-Commerce', 'Top-Up', 'Custom']

  const products = [
    {
      id: 1,
      title: 'POS Terminal Go',
      desc: 'Mobile bluetooth receipt billing & QR pay',
      price: '$120.00',
      rating: '4.9',
      badge: 'Bestseller',
      bg: 'from-emerald-500/20 to-teal-500/10'
    },
    {
      id: 2,
      title: 'MLBB Diamond FastPay',
      desc: 'Automated in-app topup instant check',
      price: '$5.50',
      rating: '5.0',
      badge: 'Popular',
      bg: 'from-purple-500/20 to-indigo-500/10'
    },
    {
      id: 3,
      title: 'Store Manager Mobile',
      desc: 'Real-time stock, orders & employee control',
      price: '$89.00',
      rating: '4.8',
      badge: 'Pro System',
      bg: 'from-cyan-500/20 to-blue-500/10'
    },
    {
      id: 4,
      title: 'Customer Loyalty App',
      desc: 'Points, push notifications & QR scanner',
      price: '$45.00',
      rating: '4.9',
      badge: 'Interactive',
      bg: 'from-amber-500/20 to-orange-500/10'
    }
  ]

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 flex items-center justify-center p-2 sm:p-4 select-none font-sans">
      {/* Mobile Device Mockup Frame */}
      <div className="w-full max-w-[390px] h-[780px] bg-zinc-950 rounded-[44px] border-[5px] border-zinc-800 shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden relative">
        
        {/* Dynamic Island / Notch Bar */}
        <div className="pt-3 px-6 pb-2 flex items-center justify-between text-xs text-zinc-400 bg-zinc-950/80 backdrop-blur-md z-30">
          <span className="font-mono font-semibold text-white text-[13px]">9:41</span>
          
          {/* Island Pill */}
          <div className="w-24 h-5 rounded-full bg-black border border-white/10 flex items-center justify-center gap-1.5 px-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-mono text-emerald-400 font-bold tracking-wider">PEAK OS</span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-300">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-none">
          
          {/* App Header */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 tracking-wider uppercase font-semibold block">
                Mobile App Architecture
              </span>
              <h1 className="text-lg font-bold text-white">Peak Deth Mobile</h1>
            </div>
            <div className="relative p-2 rounded-xl bg-zinc-900 border border-white/10 text-white">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-black text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              readOnly
              placeholder="Search mobile systems & apps..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-900/90 border border-white/10 text-zinc-200 placeholder:text-zinc-500 focus:outline-none"
            />
          </div>

          {/* Hero Banner Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-950/40 to-black border border-emerald-500/30 relative overflow-hidden">
            <div className="relative z-10 space-y-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Sparkles className="w-2.5 h-2.5" /> HYBRID NATIVE
              </span>
              <h2 className="text-sm font-bold text-white leading-snug">
                React Native &amp; Flutter Custom Apps
              </h2>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                High-performance iOS &amp; Android systems with offline SQLite sync and real-time backend API.
              </p>
              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCartCount(prev => prev + 1)}
                  className="px-3 py-1 rounded-lg bg-emerald-400 text-black font-bold text-[11px] hover:bg-emerald-300 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Try Demo</span>
                </button>
                <span className="text-[10px] font-mono text-emerald-400">60 FPS Ultra Fast</span>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-white text-black font-bold'
                    : 'bg-zinc-900 text-zinc-400 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product / App Systems Grid */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-bold text-white">Featured Mobile Systems</span>
              <span className="text-[10px] text-emerald-400 font-mono">4 Systems Ready</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {products.map((p) => (
                <div
                  key={p.id}
                  className={`p-3 rounded-2xl bg-gradient-to-br ${p.bg} border border-white/10 flex flex-col justify-between space-y-2 hover:border-white/20 transition-all`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-white border border-white/10">
                        {p.badge}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400">★ {p.rating}</span>
                    </div>
                    <h3 className="text-xs font-bold text-white line-clamp-1">{p.title}</h3>
                    <p className="text-[10px] text-zinc-400 line-clamp-2 leading-tight mt-0.5">
                      {p.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-xs font-bold font-mono text-white">{p.price}</span>
                    <button
                      type="button"
                      onClick={() => setCartCount(c => c + 1)}
                      className="w-6 h-6 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-black text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Telemetry Banner */}
          <div className="p-3 rounded-xl bg-zinc-900/90 border border-white/10 text-[10px] font-mono text-zinc-400 space-y-1">
            <div className="flex items-center justify-between text-zinc-300">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> API ENGINE CONNECTED
              </span>
              <span className="text-zinc-500">LATENCY: 14ms</span>
            </div>
            <div className="text-[9px] text-zinc-500">
              Cross-Platform iOS 18+ • Android 15 • Supabase GraphQL Backend
            </div>
          </div>
        </div>

        {/* Bottom Tab Bar */}
        <div className="px-6 py-3 bg-zinc-950 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500 z-30">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-emerald-400' : 'hover:text-zinc-300'}`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[9px] font-mono font-bold">Home</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('explore')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'explore' ? 'text-emerald-400' : 'hover:text-zinc-300'}`}
          >
            <Compass className="w-4 h-4" />
            <span className="text-[9px] font-mono font-bold">Apps</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'notifications' ? 'text-emerald-400' : 'hover:text-zinc-300'}`}
          >
            <Bell className="w-4 h-4" />
            <span className="text-[9px] font-mono font-bold">Alerts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-emerald-400' : 'hover:text-zinc-300'}`}
          >
            <User className="w-4 h-4" />
            <span className="text-[9px] font-mono font-bold">Admin</span>
          </button>
        </div>

        {/* Bottom Home Indicator Line */}
        <div className="pb-2 flex justify-center bg-zinc-950">
          <div className="w-32 h-1 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  )
}
