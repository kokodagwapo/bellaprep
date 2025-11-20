import React from 'react';
import { motion } from 'framer-motion';
import { FilePlus2, FileText, LayoutList, Shield, Zap, CheckCircle2, UploadCloud, Smartphone, Scan } from './icons';
import Hero from './Hero';

interface LandingPageProps {
  onNavigateToPrep?: () => void;
  onNavigateToForm1003?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToPrep, onNavigateToForm1003 }) => {

  const mainProducts = [
    {
      icon: <FilePlus2 className="h-10 w-10 text-primary" />,
      title: "Prep4Loan",
      description: "Get pre-qualified in minutes with our streamlined pre-evaluation process.",
      action: "Start Pre-Evaluation"
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Home Journey",
      description: "Complete your URLA 1003 form with our guided, step-by-step process.",
      action: "Begin Application"
    }
  ];

  const features = [
    {
      icon: <div className="flex items-center gap-2"><Scan className="h-8 w-8 text-primary" /><UploadCloud className="h-6 w-6 text-primary" /><Smartphone className="h-6 w-6 text-primary" /></div>,
      title: "OCR Technology",
      description: "Advanced OCR automatically extracts and verifies information from driver's licenses, W-2s, and paystubs."
    },
    {
      icon: <LayoutList className="h-8 w-8 text-primary" />,
      title: "Document Management",
      description: "Track your required documents and see your progress in real-time."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "SOC2 Ready",
      description: "Bank-level security with full compliance to industry standards. Your data is protected with enterprise-grade encryption and SOC2 compliance."
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Fast Processing",
      description: "AI-powered assistance to help you complete your application quickly."
    }
  ];

  const benefits = [
    "Streamlined mortgage application process",
    "Real-time progress tracking",
    "AI-powered document verification",
    "Secure and compliant platform",
    "Expert guidance at every step"
  ];

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in">
      {/* Hero Section - Fullscreen */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-visible" style={{ marginTop: '-100px' }}>
        <Hero />
      </div>

      {/* Main Products Section */}
      <div className="mb-20 sm:mb-24 md:mb-28 lg:mb-32 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
            style={{ marginTop: '1.5in' }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-4 sm:mb-5 tracking-tight">
              Business Process Solutions
            </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light" style={{ color: '#6b7280' }}>
            Streamline your mortgage process with our comprehensive suite of tools designed to simplify every step from pre-qualification to final approval
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 max-w-6xl mx-auto">
          {mainProducts.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative bg-white rounded-2xl md:rounded-3xl border border-gray-200/80 p-8 sm:p-10 md:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-24 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 mb-6 sm:mb-8 group-hover:scale-105 group-hover:rotate-2 transition-all duration-500">
                  <div className="group-hover:scale-110 transition-transform duration-500 text-primary">
                    {product.icon}
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-foreground mb-4 sm:mb-5 group-hover:text-primary transition-colors duration-300 tracking-tight">
                  {product.title}
                </h3>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 sm:mb-10 font-light" style={{ color: '#6b7280' }}>
                  {product.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (index === 0) {
                      onNavigateToPrep?.();
                    } else {
                      onNavigateToForm1003?.();
                    }
                  }}
                  className="w-full bg-primary text-white font-light py-4 px-8 rounded-xl hover:bg-primary/90 transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-primary/40 shadow-md hover:shadow-lg text-base sm:text-lg touch-manipulation min-h-[50px]"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {product.action}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="mb-20 sm:mb-24 md:mb-28 lg:mb-32 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-4 sm:mb-5 tracking-tight">
            Additional Features
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light" style={{ color: '#6b7280' }}>
            Everything you need for a seamless mortgage experience
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 mb-5 sm:mb-6 group-hover:scale-105 transition-transform duration-300">
                  <div className="group-hover:scale-110 transition-transform duration-300 text-primary">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-light text-foreground mb-3 group-hover:text-primary transition-colors duration-300 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-light" style={{ color: '#6b7280' }}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative mb-20 sm:mb-24 md:mb-28 lg:mb-32 px-4 sm:px-6">
        <div className="relative bg-white rounded-3xl border border-gray-200/80 p-8 sm:p-12 md:p-16 lg:p-20 shadow-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-foreground text-center mb-12 sm:mb-16 tracking-tight">
              Why Choose Our Platform?
            </h2>
            
            <div className="space-y-5 sm:space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.08, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex items-start gap-4 sm:gap-5 group cursor-default"
                >
                  <div className="flex-shrink-0 mt-0.5 p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <p className="text-base sm:text-lg md:text-xl text-foreground font-light pt-0.5 group-hover:text-primary transition-colors duration-300">
                    {benefit}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center px-4 sm:px-6 mb-16 sm:mb-20"
      >
        <div className="relative bg-gradient-to-br from-white to-gray-50/50 rounded-3xl p-10 sm:p-14 md:p-18 lg:p-24 shadow-xl border border-gray-200/80 overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-5 sm:mb-6 md:mb-8 tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-light" style={{ color: '#6b7280' }}>
              Join thousands of borrowers who have simplified their mortgage application process with our platform.
            </p>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigateToPrep?.()}
              className="group relative w-full sm:w-auto sm:min-w-[240px] md:min-w-[280px] bg-gradient-to-r from-primary via-primary to-green-600 text-white font-light py-4 sm:py-5 md:py-6 px-10 sm:px-12 md:px-16 rounded-xl md:rounded-2xl hover:from-green-600 hover:via-primary hover:to-primary transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-primary/40 shadow-lg hover:shadow-xl hover:shadow-primary/25 text-base sm:text-lg md:text-xl touch-manipulation min-h-[52px] sm:min-h-[56px] md:min-h-[60px] overflow-hidden"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Begin Your Journey
                <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;

