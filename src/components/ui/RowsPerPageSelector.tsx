'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface RowsPerPageSelectorProps {
   value: number;
   onChange: (value: number) => void;
}

export function RowsPerPageSelector({ value, onChange }: RowsPerPageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const options = [5, 10, 20, 25, 100];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-xl border transition-all duration-200
                    text-sm font-bold text-bakery-text
                    ${isOpen 
                        ? 'bg-pink-50 border-pink-300 ring-2 ring-pink-100 text-bakery-pink' 
                        : 'bg-white border-gray-100 shadow-sm hover:border-pink-200 hover:bg-gray-50'
                    }
                `}
            >
                <span>{value} Baris</span>
                <ChevronDown 
                    size={16} 
                    className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-pink-400' : ''}`} 
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-1">
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className={`
                                    w-full text-left px-4 py-2 text-sm font-semibold flex items-center justify-between group transition-colors
                                    ${value === option 
                                        ? 'bg-pink-50 text-bakery-pink' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-bakery-text'
                                    }
                                `}
                            >
                                {option}
                                {value === option && <Check size={14} className="text-pink-500" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
