import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Film, 
  Mail, 
  ArrowRight, 
  Check, 
  MapPin, 
  Phone, 
  UtensilsCrossed, 
  ShieldCheck, 
  Sparkles,
  Heart
} from 'lucide-react';
import { Button } from '../ui/Button';
import { UploadFoodReelModal } from '../partner/UploadFoodReelModal';
import { useAppContext } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppContext() || {};
  const isPartner = isAuthenticated && user?.userType === 'partner';

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleUploadClick = () => {
    if (isPartner) {
      navigate('/partner/addfood');
    } else {
      setIsUploadModalOpen(true);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#0D0D11] border-t border-white/[0.08] pt-16 pb-28 md:pb-16 text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter CTA Section */}
        <div className="rounded-3xl bg-gradient-to-r from-[#18181F] to-[#1E1E28] border border-white/10 p-6 sm:p-10 mb-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF462D]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFB703]/15 border border-[#FFB703]/30 text-[11px] font-semibold text-[#FFB703]">
                <Sparkles className="w-3 h-3" />
                <span>Exclusive Secret Deals</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
                Unlock 40% Off Your First 3 Orders
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-lg">
                Join 50,000+ food lovers. Receive weekly chef specials, secret discount codes, and new reel drops.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 bg-[#121217] border border-white/15 rounded-xl pl-10 pr-4 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF462D]/60"
                  />
                </div>
                <Button variant="default" size="md" className="shrink-0 font-bold">
                  {isSubscribed ? (
                    <span className="flex items-center gap-1.5 text-emerald-300">
                      <Check className="w-4 h-4" /> Subscribed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      Get Deals <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF462D] to-[#FF6B4A] flex items-center justify-center shadow-lg shadow-[#FF462D]/30 border border-[#FF6B4A]/50">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                Food<span className="text-[#FF462D]">In</span>Reels
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              India's premier video-first food discovery platform. Watch sizzling kitchen reels, discover gourmet secrets, and enjoy express doorstep delivery.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <MapPin className="w-3.5 h-3.5 text-[#FF462D]" />
              <span>Available in 20+ major metropolitan cities</span>
            </div>
          </div>

          {/* Quick Discover */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-heading">
              Discover
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/reel" className="hover:text-white transition-colors">🔥 Trending Reels</Link></li>
              <li><a href="#trending-feed" className="hover:text-white transition-colors">🍕 Pizza & Italian</a></li>
              <li><a href="#trending-feed" className="hover:text-white transition-colors">🍗 Hyderabadi Biryani</a></li>
              <li><a href="#trending-feed" className="hover:text-white transition-colors">🥗 Healthy Vegan Bowls</a></li>
              <li><a href="#trending-feed" className="hover:text-white transition-colors">🍰 Gourmet Desserts</a></li>
            </ul>
          </div>

          {/* For Partners */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-heading">
              For Kitchens
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/partner/register" className="text-[#FFB703] font-medium hover:underline">Partner With Us</Link></li>
              <li><Link to="/partner/login" className="hover:text-white transition-colors">Restaurant Portal</Link></li>
              <li>
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="hover:text-white transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span>Upload Food Reel</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] animate-pulse"></span>
                </button>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">Merchant Guidelines</a></li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-heading">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hygiene Standards</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} FoodInReels Inc. All rights reserved. Crafted with care for foodies.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3.5 h-3.5 text-[#FF462D] fill-[#FF462D]" /> for incredible taste
            </span>
          </div>
        </div>

      </div>

      {/* Upload Food Reel Window Access / Dropzone Modal */}
      <UploadFoodReelModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </footer>
  );
};

export default Footer;

