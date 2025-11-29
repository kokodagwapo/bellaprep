import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BellaModal from './BellaModal';

const BellaOrb: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <motion.div
          className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-green-600 shadow-lg flex items-center justify-center"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span className="text-white text-2xl">👋</span>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isOpen && <BellaModal onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default BellaOrb;

