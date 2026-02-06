import React from 'react';
import { Menu, BarChart2 } from 'lucide-react';
import { STYLES } from '../utils/styles';
import { playSound, SOUNDS } from '../utils/soundEffects';

const MobileHeader = ({ setIsMobileNavOpen, setIsMobileContextOpen, userProfile }) => {
    const handleOpenNav = () => {
        playSound(SOUNDS.CLICK, userProfile?.soundEffects);
        setIsMobileNavOpen(true);
    };

    const handleOpenContext = () => {
        playSound(SOUNDS.CLICK, userProfile?.soundEffects);
        setIsMobileContextOpen(true);
    };

    return (
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900 shrink-0">
            <button onClick={handleOpenNav} className={STYLES.BUTTON.ICON_BUTTON}>
                <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight">VibeStylist</span>
                {(userProfile?.streak || 0) > 0 && (
                    <span className="text-xs text-orange-400 font-bold bg-orange-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        🔥 {userProfile.streak}
                    </span>
                )}
            </div>
            <button onClick={handleOpenContext} className={STYLES.BUTTON.ICON_BUTTON + " -mr-2"}>
                <BarChart2 size={24} />
            </button>
        </div>
    );
};

export default MobileHeader;
