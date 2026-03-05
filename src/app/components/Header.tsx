'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import {useDarkMode} from './DarkModeProvider';

export default function Header() {
    const {theme, setTheme} = useDarkMode();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLElement | null>(null);

    const handleThemeToggle = () => {
        if (theme === 'light') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    };

    const getThemeIcon = () => {
        if (theme === 'light') {
            return '☀️';
        } else {
            return '🌙';
        }
    };

    const getThemeLabel = () => {
        if (theme === 'light') {
            return 'ライトモード';
        } else {
            return 'ダークモード';
        }
    };

    const navLinkClass = (href: string) => {
        const isActive = pathname !== null && (pathname === href || (href === '/yearly' && pathname.startsWith('/yearly')));
        return `px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            isActive
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`;
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b
            border-gray-200 dark:border-gray-700 sticky top-0 z-50"
            ref={menuRef}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <button
                            className="md:hidden flex items-center p-2 text-gray-700 dark:text-gray-300
                            hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                            onClick={() => setMenuOpen((prev) => !prev)}
                            aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
                            aria-expanded={menuOpen}
                            aria-controls={menuOpen ? 'mobile-menu' : undefined}
                        >
                            ☰
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                            nisa
                        </h1>
                        <nav className="hidden md:flex items-center gap-2 ml-4">
                            <Link href="/" className={navLinkClass('/')}>
                                全体
                            </Link>
                            <Link href="/yearly" className={navLinkClass('/yearly')}>
                                年別
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center">
                        <button
                            onClick={handleThemeToggle}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium
                            text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700
                            rounded-lg transition-colors duration-200"
                            title={`現在: ${getThemeLabel()}`}
                        >
                            <span className="text-lg">{getThemeIcon()}</span>
                            <span className="hidden sm:inline">{getThemeLabel()}</span>
                        </button>
                    </div>
                </div>
            </div>

            {menuOpen && (
                <div id="mobile-menu" className="md:hidden absolute top-16 left-0 w-full bg-white/95 dark:bg-gray-800/95
                    backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-lg">
                    <nav className="flex flex-col p-4 gap-2">
                        <Link
                            href="/"
                            className={navLinkClass('/')}
                            onClick={() => setMenuOpen(false)}
                        >
                            全体
                        </Link>
                        <Link
                            href="/yearly"
                            className={navLinkClass('/yearly')}
                            onClick={() => setMenuOpen(false)}
                        >
                            年別
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
