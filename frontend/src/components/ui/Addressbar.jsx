import { EllipsisVertical, Home, Briefcase, MapPin, Check, Edit2, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

const Addressbar = ({
    id,
    label,
    fullName,
    phone,
    country,
    address,
    landmark,
    isDefault,
    state,
    city,
    locality,
    postalCode,
    className,
    onDelete,
    onEdit
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleEditClick = () => {
        onEdit({
            id,
            label,
            fullName,
            phone,
            locality,
            address,
            city,
            state,
            postalCode,
            country,
            landmark,
            isDefault
        });
        setIsMenuOpen(false);
    };

    const handleDeleteClick = () => {
        onDelete(id);
        setIsMenuOpen(false);
    };

    const isWork = String(label || '').toLowerCase() === 'work';

    return (
        <div className={`bg-white/80 dark:bg-gray-900/80 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 rounded-xl p-5 transition-all ${className}`}>
            <div className='flex justify-between items-center mb-3'>
                <div className='flex items-center gap-2'>
                    <span className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700'>
                        {isWork ? <Briefcase size={12} className="text-sky-500" /> : <Home size={12} className="text-emerald-500" />}
                        {label || 'Home'}
                    </span>
                    {isDefault && (
                        <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'>
                            <Check size={11} /> Default
                        </span>
                    )}
                </div>
                <div className='relative'>
                    <button
                        type="button"
                        onClick={handleMenuClick}
                        aria-label="Address actions"
                        className='p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                    >
                        <EllipsisVertical size={18} />
                    </button>
                    {isMenuOpen && (
                        <div className='absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg z-10 py-1 text-sm'>
                            <button
                                onClick={handleEditClick}
                                className='w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors'
                            >
                                <Edit2 size={14} /> Edit
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className='w-full flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700/50 transition-colors border-t border-slate-100 dark:border-gray-700'
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Name and phone */}
            <div className='flex flex-wrap items-center gap-3 mb-2'>
                <p className='font-semibold text-slate-900 dark:text-white text-base'>{fullName || 'John Doe'}</p>
                <span className='text-xs text-slate-400'>•</span>
                <p className='text-sm text-slate-600 dark:text-slate-400 font-medium'>{phone || '+91 9876543210'}</p>
            </div>

            {/* Formatted address details */}
            <div className='text-sm text-slate-600 dark:text-slate-300 space-y-0.5 leading-relaxed'>
                <p>{[address, locality].filter(Boolean).join(', ')}</p>
                <p className='text-xs text-slate-500 dark:text-slate-400'>
                    {[city, state].filter(Boolean).join(', ')}{postalCode ? ` - ${postalCode}` : ''}, {country || 'India'}
                    {landmark ? ` • Near ${landmark}` : ''}
                </p>
            </div>
        </div>
    );
};

export default Addressbar;
