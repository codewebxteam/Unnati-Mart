import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ShoppingBag, ShoppingCart, Heart } from 'lucide-react';

// Components Import
import ProfileSettings from '../../components/profile/profile';

const Dashboard = () => {
  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Content Area */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-sm border border-slate-100 min-h-[500px]"
            >
              <ProfileSettings />
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;