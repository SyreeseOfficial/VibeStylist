import React from 'react';
import { Menu, BarChart2 } from 'lucide-react';
import { STYLES } from '../utils/styles';

const MobileHeader = ({ setIsMobileNavOpen, setIsMobileContextOpen }) => {
    return (
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900 shrink-0">
            <button onClick={() => setIsMobileNavOpen(true)} className={STYLES.BUTTON.ICON_BUTTON}>
                <Menu size={24} />
            </button>
            <span className="font-bold text-lg tracking-tight">VibeStylist</span>
            <button onClick={() => setIsMobileContextOpen(true)} className={STYLES.BUTTON.ICON_BUTTON + " -mr-2"}>
                <BarChart2 size={24} />
            </button>
        </div>
    );
};

export default MobileHeader;
