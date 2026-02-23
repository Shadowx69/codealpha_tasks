import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, User } from 'lucide-react';

export const IncomingInvite = ({ invite, onAccept, onDecline }) => {
    return (
        <AnimatePresence>
            {invite && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
                >
                    <div className="bg-bottle/90 backdrop-blur-md border border-bottle-light shadow-2xl rounded-2xl p-4 w-full max-w-sm flex items-center justify-between gap-4">

                        <div className="flex items-center gap-3">
                            <div className="bg-emerald/20 p-3 rounded-full relative">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="absolute inset-0 bg-emerald/30 rounded-full"
                                />
                                <User className="text-emerald relative z-10" size={24} />
                            </div>
                            <div>
                                <h4 className="text-cream font-semibold flex items-center gap-2">
                                    {invite.inviterName}
                                </h4>
                                <p className="text-sage-light text-sm">is inviting you to a room</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={onDecline}
                                className="bg-sage/10 hover:bg-sage/20 text-sage-dark p-3 rounded-full transition-colors"
                            >
                                <PhoneOff size={20} />
                            </button>
                            <button
                                onClick={onAccept}
                                className="bg-emerald hover:bg-emerald-dark text-cream p-3 rounded-full shadow-lg shadow-emerald/30 transition-transform hover:scale-105"
                            >
                                <Phone size={20} className="animate-pulse" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
