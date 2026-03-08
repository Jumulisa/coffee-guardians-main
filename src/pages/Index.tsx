import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Leaf, Shield, Zap, Globe, Scan, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

const Index = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const videoRefDesktop = useRef<HTMLVideoElement>(null);
  const videoRefMobile = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Auto-play videos on mount
  useEffect(() => {
    const playVideos = () => {
      if (videoRefDesktop.current) {
        videoRefDesktop.current.play().catch(() => {});
      }
      if (videoRefMobile.current) {
        videoRefMobile.current.play().catch(() => {});
      }
    };
    
    // Small delay to ensure video is loaded
    const timer = setTimeout(playVideos, 500);
    return () => clearTimeout(timer);
  }, []);

  const partners = [
    { name: "Rwanda Agriculture Board", abbr: "RAB" },
    { name: "NAEB", abbr: "NAEB" },
    { name: "University of Rwanda", abbr: "UR" },
    { name: "IITA", abbr: "IITA" },
  ];

  // Generate floating particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 10,
    size: 2 + Math.random() * 4,
  }));

  // Generate scanning lines
  const scanLines = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    delay: i * 2,
  }));

  const handleStartDiagnosis = () => {
    navigate('/upload');
  };

  const handleMobileVideoHover = () => {
    if (videoRefMobile.current) {
      videoRefMobile.current.play();
      setIsVideoPlaying(true);
    }
  };

  const handleMobileVideoLeave = () => {
    if (videoRefMobile.current) {
      videoRefMobile.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const handleDesktopVideoHover = () => {
    if (videoRefDesktop.current) {
      videoRefDesktop.current.play();
      setIsVideoPlaying(true);
    }
  };

  const handleDesktopVideoLeave = () => {
    if (videoRefDesktop.current) {
      videoRefDesktop.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const toggleMobileSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRefMobile.current) {
      videoRefMobile.current.muted = !videoRefMobile.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const toggleDesktopSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRefDesktop.current) {
      videoRefDesktop.current.muted = !videoRefDesktop.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1a0f0a] via-[#2d1810] to-[#1a0f0a] text-white relative overflow-hidden">
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-green-500/30 particle"
            style={{
              left: `${p.left}%`,
              bottom: '-20px',
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Scanning Lines Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {scanLines.map((line) => (
          <div
            key={line.id}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent animate-scan-horizontal"
            style={{
              top: '50%',
              animationDelay: `${line.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Background glow effects - now with pulse animation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#3d2517]/30 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-green-900/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-900/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

      {/* Rotating gradient ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20 animate-spin-slow pointer-events-none">
        <div className="absolute inset-0 rounded-full border border-green-500/20"></div>
        <div className="absolute inset-4 rounded-full border border-amber-500/10"></div>
        <div className="absolute inset-8 rounded-full border border-green-500/10"></div>
        {/* Orbiting dot */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
      </div>

      {/* DNA Helix Lines */}
      <div className="absolute left-1/4 top-0 bottom-0 w-px opacity-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500 to-transparent animate-dna-flow"></div>
      </div>
      <div className="absolute right-1/4 top-0 bottom-0 w-px opacity-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500 to-transparent animate-dna-flow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-16">
          {/* Tagline */}
          <div className="flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-white/60 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-green-500 rounded-sm animate-pulse"></span>
            {language === 'rw' ? 'KURINDA IKAWA YAWE' : 'AI-POWERED COFFEE PROTECTION'}
          </div>

          {/* Central Visual - Coffee Leaf with floating animation */}
          <div className="mb-8 animate-fade-in relative">
            {/* Glow behind leaf */}
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl scale-150 animate-pulse-glow"></div>
            {/* Scanning circle around leaf */}
            <div className="absolute inset-0 scale-[1.8] animate-spin-slow">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-green-500/20"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <Leaf className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 text-green-500/70 drop-shadow-2xl animate-float relative z-10" strokeWidth={1} />
            {/* Scan icon */}
            <Scan className="absolute -bottom-2 -right-2 w-8 h-8 text-green-400/50 animate-pulse" />
          </div>

          {/* Main Title with text glow */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-center leading-tight mb-2 animate-slide-up animate-text-glow">
            {language === 'rw' ? 'Kurinda' : 'Protect Your'}
          </h1>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-center leading-tight mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {language === 'rw' ? 'Imirima Yawe' : 'Coffee Harvest'}
          </h1>

          {/* CTA Button with portal effect */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button
              variant="outline"
              size="lg"
              onClick={handleStartDiagnosis}
              className="bg-transparent border-white/30 text-white hover:bg-green-500/20 hover:border-green-500 hover:scale-110 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] rounded-full px-8 py-6 text-base tracking-wide transition-all duration-500 group relative overflow-hidden"
            >
              {/* Animated border gradient */}
              <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="absolute inset-0 rounded-full animate-border-spin bg-gradient-conic from-green-500 via-transparent to-green-500"></span>
              </span>
              <span className="absolute inset-[2px] rounded-full bg-[#1a0f0a]"></span>
              <span className="absolute inset-0 animate-shimmer"></span>
              <span className="relative flex items-center gap-3">
                <Scan className="w-5 h-5 group-hover:animate-pulse" />
                {language === 'rw' ? 'TANGIRA ISUZUMA' : 'START DIAGNOSIS'}
                <span className="w-2 h-2 bg-green-500 rounded-full group-hover:bg-green-400 group-hover:scale-150 transition-all duration-300 animate-pulse"></span>
              </span>
            </Button>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="text-center animate-float-slow">
              <p className="text-3xl font-bold text-green-400">10K+</p>
              <p className="text-xs text-white/50 uppercase tracking-wider">Scans</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center animate-float-slow" style={{ animationDelay: '0.3s' }}>
              <p className="text-3xl font-bold text-amber-400">95%</p>
              <p className="text-xs text-white/50 uppercase tracking-wider">Accuracy</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center animate-float-slow" style={{ animationDelay: '0.6s' }}>
              <p className="text-3xl font-bold text-blue-400">4</p>
              <p className="text-xs text-white/50 uppercase tracking-wider">Diseases</p>
            </div>
          </div>

          {/* Video Preview Section - Visible on mobile/tablet */}
          <div className="mt-12 lg:hidden animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div 
              className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden"
            >
              {/* Video container with border glow */}
              <div className="absolute inset-0 rounded-2xl ring-2 ring-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)] z-10 pointer-events-none" />
              
              <video
                ref={videoRefMobile}
                className="w-full h-56 object-cover rounded-2xl"
                muted
                loop
                playsInline
                autoPlay
                poster="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80"
                onLoadedData={() => videoRefMobile.current?.play()}
              >
                {/* Local coffee video */}
                <source src="/coffee.mp4" type="video/mp4" />
              </video>
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Mute button */}
              <button
                onClick={toggleMobileSound}
                className="absolute bottom-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/70 transition-all z-20"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Label */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30 z-10">
                <p className="text-xs text-green-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  {language === 'rw' ? 'KAWA' : 'COFFEE GUARDIAN'}
                </p>
              </div>

              {/* Caption */}
              <div className="absolute bottom-3 left-3 z-10">
                <p className="text-white/90 text-sm font-medium">
                  {language === 'rw' ? 'Kurinda ikawa yawe' : 'Protect Your Coffee'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="px-4 pb-8">
          {/* Description Text - Left aligned */}
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8 items-end">
              {/* Left - Description */}
              <div className="max-w-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <p className="text-sm text-white/60 leading-relaxed">
                  {language === 'rw' 
                    ? "Coffee Guardian ikoresha ubuhanga bwa AI kugira ngo imenye indwara z'ikawa, itange inama zo kuvura, kandi ifashe abahinzi b'Abanyarwanda kurinda imirima yabo."
                    : 'Coffee Guardian uses advanced AI to detect coffee leaf diseases, provide treatment recommendations, and help Rwandan smallholder farmers protect their valuable harvests.'}
                </p>
              </div>

              {/* Right - Partners */}
              <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <p className="text-xs tracking-[0.2em] uppercase text-white/40 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-white/40 rounded-sm"></span>
                  {language === 'rw' ? 'DUFATANYIJE NA' : 'MADE POSSIBLE BY'}
                </p>
                <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                  {partners.map((partner, i) => (
                    <div 
                      key={i} 
                      className="text-white/50 hover:text-white/80 hover:scale-110 transition-all duration-300 cursor-default"
                      style={{ animationDelay: `${0.6 + i * 0.1}s` }}
                    >
                      <span className="text-sm font-medium tracking-wide">{partner.abbr}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="container mx-auto max-w-6xl mt-12 pt-6 border-t border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-white/40">
              <div>© 2026 COFFEE GUARDIAN</div>
              <div className="flex items-center gap-6">
                <Link to="/diseases" className="hover:text-white/70 hover:scale-105 transition-all duration-300">
                  {language === 'rw' ? 'INDWARA' : 'DISEASES'}
                </Link>
                <Link to="/history" className="hover:text-white/70 hover:scale-105 transition-all duration-300">
                  {language === 'rw' ? 'AMATEKA' : 'HISTORY'}
                </Link>
                <Link to="/settings" className="hover:text-white/70 hover:scale-105 transition-all duration-300">
                  {language === 'rw' ? 'IGENAMITERERE' : 'SETTINGS'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features - Floating cards on sides (visible on larger screens) */}
      {/* Left side - Feature cards */}
      <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 space-y-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 w-48 hover:bg-white/10 hover:border-green-500/30 hover:scale-105 transition-all duration-300 animate-float-slow">
          <Shield className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-xs text-white/70">95% Detection Accuracy</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 w-48 hover:bg-white/10 hover:border-amber-500/30 hover:scale-105 transition-all duration-300 animate-float-slow" style={{ animationDelay: '1s' }}>
          <Zap className="w-5 h-5 text-amber-500 mb-2" />
          <p className="text-xs text-white/70">Instant Results</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 w-48 hover:bg-white/10 hover:border-blue-500/30 hover:scale-105 transition-all duration-300 animate-float-slow" style={{ animationDelay: '0.5s' }}>
          <Globe className="w-5 h-5 text-blue-400 mb-2" />
          <p className="text-xs text-white/70">Works Offline (PWA)</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 w-48 hover:bg-white/10 hover:border-green-500/30 hover:scale-105 transition-all duration-300 animate-float-slow" style={{ animationDelay: '1.5s' }}>
          <Leaf className="w-5 h-5 text-green-400 mb-2" />
          <p className="text-xs text-white/70">4 Disease Types</p>
        </div>
      </div>

      {/* Right side - Video Card with auto-play */}
      <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 animate-fade-in" style={{ animationDelay: '0.7s' }}>
        <div 
          className="relative w-80 rounded-xl overflow-hidden cursor-pointer group"
          onMouseEnter={handleDesktopVideoHover}
          onMouseLeave={handleDesktopVideoLeave}
        >
          <div className="absolute inset-0 rounded-xl transition-all duration-500 z-10 pointer-events-none ring-2 ring-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.2)]" />
          
          <video
            ref={videoRefDesktop}
            className="w-full h-64 object-cover rounded-xl"
            muted
            loop
            playsInline
            autoPlay
            poster="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80"
            onLoadedData={() => videoRefDesktop.current?.play()}
          >
            {/* Local coffee video */}
            <source src="/coffee.mp4" type="video/mp4" />
          </video>
          
          {/* Gradient overlay for aesthetics */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

          {/* Mute/unmute button */}
          <button
            onClick={toggleDesktopSound}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/70 transition-all z-20"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Label */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30 z-10">
            <p className="text-xs text-green-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              {language === 'rw' ? 'KAWA' : 'COFFEE GUARDIAN'}
            </p>
          </div>

          {/* Caption */}
          <div className="absolute bottom-3 left-3 z-10">
            <p className="text-white/90 text-sm font-medium">
              {language === 'rw' ? 'Kurinda ikawa yawe' : 'Protect Your Coffee'}
            </p>
            <p className="text-white/50 text-xs">
              {language === 'rw' ? 'AI isuzuma indwara' : 'AI Disease Detection'}
            </p>
          </div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-20 left-4 w-32 h-32 border border-white/5 rounded-full animate-spin-slow opacity-30"></div>
      <div className="absolute bottom-20 right-4 w-24 h-24 border border-green-500/10 rounded-full animate-spin-slow opacity-30" style={{ animationDirection: 'reverse' }}></div>
    </main>
  );
};

export default Index;
