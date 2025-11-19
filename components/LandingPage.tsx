import React from 'react';
import { motion } from 'framer-motion';
import { FilePlus2, FileText, LayoutList, Shield, Zap, Users, CheckCircle2 } from './icons';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <FilePlus2 className="h-8 w-8 text-primary" />,
      title: "Prep4Loan",
      description: "Get pre-qualified in minutes with our streamlined pre-evaluation process."
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Loan Application",
      description: "Complete your URLA 1003 form with our guided, step-by-step process."
    },
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
      <div className="text-center mb-12 sm:mb-16 md:mb-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <img 
            src={`${import.meta.env.BASE_URL}TeraTrans.png`}
            alt="TERAVERDE Logo" 
            className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[200px] object-contain"
            style={{ maxHeight: '80px', width: 'auto', height: 'auto' }}
            onError={(e) => {
              console.error('Logo failed to load');
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-sm sm:text-base font-medium text-muted-foreground"
            style={{ color: '#6b7280' }}
          >
            Business Process Solutions
          </motion.span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6"
        >
          Transform Your Mortgage Journey
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-12"
        >
          Experience a seamless, AI-powered mortgage application process designed to save you time and simplify every step.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => window.location.hash = '#prep4loan'}
            className="w-full sm:w-auto sm:min-w-[220px] bg-primary text-primary-foreground font-bold py-4 sm:py-4 px-8 sm:px-10 rounded-xl sm:rounded-2xl hover:bg-primary/90 transition duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg hover:shadow-xl text-base sm:text-lg touch-manipulation min-h-[56px] sm:min-h-[52px]"
          >
            Get Started
          </button>
          <button
            onClick={() => window.location.hash = '#loan-application'}
            className="w-full sm:w-auto sm:min-w-[220px] bg-white text-primary border-2 border-primary font-bold py-4 sm:py-4 px-8 sm:px-10 rounded-xl sm:rounded-2xl hover:bg-primary/5 transition duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-base sm:text-lg touch-manipulation min-h-[56px] sm:min-h-[52px]"
          >
            Start Application
          </button>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="mb-12 sm:mb-16 md:mb-20 px-4">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-8 sm:mb-12"
        >
          Everything You Need in One Platform
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
              className="bg-gradient-to-br from-card via-card to-card/95 rounded-2xl border border-border/60 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 mb-4 sm:mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-3xl p-8 sm:p-12 md:p-16 mb-12 sm:mb-16 md:mb-20 mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-8 sm:mb-12">
            Why Choose Our Platform?
          </h2>
          
          <div className="space-y-4 sm:space-y-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 + index * 0.1, duration: 0.6 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <p className="text-base sm:text-lg text-foreground font-medium">
                  {benefit}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="text-center px-4 mb-8 sm:mb-12"
      >
        <div className="bg-gradient-to-br from-card via-card to-card/95 rounded-3xl border border-border/60 p-8 sm:p-12 md:p-16 shadow-xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto">
            Join thousands of borrowers who have simplified their mortgage application process with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.hash = '#prep4loan'}
              className="w-full sm:w-auto sm:min-w-[220px] bg-primary text-primary-foreground font-bold py-4 sm:py-4 px-8 sm:px-10 rounded-xl sm:rounded-2xl hover:bg-primary/90 transition duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg hover:shadow-xl text-base sm:text-lg touch-manipulation min-h-[56px] sm:min-h-[52px]"
            >
              Begin Your Journey
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;

