import React from 'react';
import { motion } from 'framer-motion';
import { FilePlus2, FileText, LayoutList, Shield, Zap, Users, CheckCircle2 } from './icons';

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
      icon: <LayoutList className="h-8 w-8 text-primary" />,
      title: "Document Management",
      description: "Track your required documents and see your progress in real-time."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure & Compliant",
      description: "Bank-level security with full compliance to industry standards."
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Fast Processing",
      description: "AI-powered assistance to help you complete your application quickly."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Expert Support",
      description: "Get help from our AI assistant Bella, available 24/7."
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
      {/* Hero Section */}
      <div className="relative text-center mb-16 sm:mb-20 md:mb-24 px-4 pt-8 sm:pt-12">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent rounded-3xl blur-3xl opacity-50"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-4 sm:gap-5 mb-8 sm:mb-10"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
            <img 
              src={`${import.meta.env.BASE_URL}TeraTrans.png`}
              alt="TERAVERDE Logo" 
              className="relative w-auto h-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] object-contain"
              style={{ maxHeight: '100px', width: 'auto', height: 'auto' }}
              onError={(e) => {
                console.error('Logo failed to load');
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </motion.div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-sm sm:text-base font-semibold text-muted-foreground tracking-wider uppercase"
            style={{ color: '#6b7280', letterSpacing: '0.1em' }}
          >
            Business Process Solutions
          </motion.span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-foreground mb-6 sm:mb-8 leading-tight bg-gradient-to-br from-foreground via-foreground to-foreground/80 bg-clip-text"
        >
          Transform Your<br className="hidden sm:block" /> Mortgage Journey
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl sm:text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto mb-10 sm:mb-14 leading-relaxed font-light"
        >
          Experience a seamless, AI-powered mortgage application process designed to save you time and simplify every step.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigateToPrep?.()}
            className="group relative w-full sm:w-auto sm:min-w-[240px] bg-primary text-primary-foreground font-bold py-5 sm:py-5 px-10 sm:px-12 rounded-2xl sm:rounded-3xl hover:bg-primary/95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-xl hover:shadow-2xl text-base sm:text-lg touch-manipulation min-h-[60px] sm:min-h-[56px] overflow-hidden"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigateToForm1003?.()}
            className="w-full sm:w-auto sm:min-w-[240px] bg-white/80 backdrop-blur-sm text-primary border-2 border-primary/30 font-bold py-5 sm:py-5 px-10 sm:px-12 rounded-2xl sm:rounded-3xl hover:bg-white hover:border-primary transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20 shadow-lg hover:shadow-xl text-base sm:text-lg touch-manipulation min-h-[60px] sm:min-h-[56px]"
          >
            Start Application
          </motion.button>
        </motion.div>
      </div>

      {/* Main Products Section */}
      <div className="mb-20 sm:mb-24 md:mb-28 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Our Main Products
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Two powerful solutions to guide you through your mortgage journey
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 max-w-6xl mx-auto">
          {mainProducts.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              whileHover={{ y: -12, scale: 1.02, transition: { duration: 0.3 } }}
              className="group relative bg-gradient-to-br from-white via-white to-white/95 backdrop-blur-sm rounded-[2rem] border-2 border-primary/20 p-10 sm:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/30">
                  <div className="group-hover:scale-110 transition-transform duration-500">
                    {product.icon}
                  </div>
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {product.title}
                </h3>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
                  {product.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (index === 0) {
                      // Navigate to Prep4Loan
                      onNavigateToPrep?.();
                    } else {
                      // Navigate to Home Journey
                      onNavigateToForm1003?.();
                    }
                  }}
                  className="w-full bg-primary text-primary-foreground font-bold py-4 px-8 rounded-2xl hover:bg-primary/90 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-lg hover:shadow-xl text-base sm:text-lg touch-manipulation"
                >
                  {product.action}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="mb-16 sm:mb-20 md:mb-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Additional Features
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for a seamless mortgage experience
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative bg-gradient-to-br from-white via-white to-white/95 backdrop-blur-sm rounded-3xl border border-border/40 p-8 sm:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/10 to-primary/5 mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative mb-16 sm:mb-20 md:mb-24 mx-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 rounded-[2.5rem] blur-2xl"></div>
        <div className="relative bg-gradient-to-br from-white/90 via-white/80 to-white/90 backdrop-blur-xl rounded-3xl border border-primary/20 p-10 sm:p-14 md:p-20 shadow-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground text-center mb-12 sm:mb-16">
              Why Choose Our Platform?
            </h2>
            
            <div className="space-y-5 sm:space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="flex items-start gap-5 group"
                >
                  <div className="flex-shrink-0 mt-1 p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  </div>
                  <p className="text-lg sm:text-xl text-foreground font-semibold pt-1 group-hover:text-primary transition-colors duration-300">
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
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center px-4 mb-12 sm:mb-16"
      >
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 rounded-[2.5rem] p-12 sm:p-16 md:p-20 shadow-2xl border border-primary/20 overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 animate-pulse"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-6 sm:mb-8">
              Ready to Get Started?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of borrowers who have simplified their mortgage application process with our platform.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigateToPrep?.()}
              className="group relative w-full sm:w-auto sm:min-w-[280px] bg-primary text-primary-foreground font-bold py-5 sm:py-6 px-12 sm:px-16 rounded-2xl sm:rounded-3xl hover:bg-primary/95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-xl hover:shadow-2xl text-lg sm:text-xl touch-manipulation min-h-[64px] sm:min-h-[60px] overflow-hidden"
            >
              <span className="relative z-10">Begin Your Journey</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;

