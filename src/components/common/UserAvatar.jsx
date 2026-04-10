import React from 'react';
import { motion } from 'framer-motion';

const UserAvatar = ({ name, size = 'md', className = '' }) => {
    // List of funny characters/emojis
    const characters = ['🦁', '🐯', '🐼', '🦊', '🐨', '🐵', '🐸', '🦄', '🐝', '🐧'];
    
    // Hash function to get consistent color and character for a name
    const getHash = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    };

    const hash = name ? getHash(name) : 0;
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    const character = characters[hash % characters.length];
    
    // Premium color palettes
    const colors = [
        'bg-amber-500', 'bg-emerald-500', 'bg-blue-500', 
        'bg-rose-500', 'bg-indigo-500', 'bg-violet-500',
        'bg-cyan-500', 'bg-orange-500', 'bg-teal-500'
    ];
    const bgColor = colors[hash % colors.length];

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-14 h-14 text-xl',
        xl: 'w-20 h-20 text-3xl'
    };

    return (
        <motion.div
            itemScope
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-full ${sizeClasses[size] || sizeClasses.md} ${bgColor} flex items-center justify-center text-white font-black shadow-lg border-2 border-white overflow-hidden relative group ${className}`}
        >
            {/* Initial */}
            <span className="relative z-10 transition-transform duration-300 group-hover:scale-0">
                {initial}
            </span>
            
            {/* Funny Character (appears on hover or can be default) */}
            <span className="absolute inset-0 flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300 pointer-events-none">
                {character}
            </span>

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-40" />
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
        </motion.div>
    );
};

export default UserAvatar;
