'use client';

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useSyncExternalStore,
    useCallback,
} from 'react';

type Theme = 'light' | 'dark';

interface DarkModeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isDark: boolean;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

function createThemeStore() {
    let currentTheme: Theme | undefined;
    const listeners = new Set<() => void>();

    const readStoredTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark' ? 'dark' : 'light';
    };

    const handleExternalChange = () => {
        currentTheme = readStoredTheme();
        listeners.forEach((listener) => listener());
    };

    return {
        subscribe: (listener: () => void) => {
            listeners.add(listener);
            window.addEventListener('storage', handleExternalChange);
            return () => {
                listeners.delete(listener);
                window.removeEventListener('storage', handleExternalChange);
            };
        },
        getSnapshot: () => currentTheme ?? readStoredTheme(),
        getServerSnapshot: () => 'light' as const,
        setTheme: (newTheme: Theme) => {
            currentTheme = newTheme;
            localStorage.setItem('theme', newTheme);
            listeners.forEach((listener) => listener());
        },
    };
}

export function DarkModeProvider({children}: { readonly children: ReactNode }) {
    const themeStore = useMemo(() => createThemeStore(), []);
    const theme = useSyncExternalStore(
        themeStore.subscribe,
        themeStore.getSnapshot,
        themeStore.getServerSnapshot,
    );
    const isDark = theme === 'dark';

    useEffect(() => {
        // HTMLタグにdarkクラスを追加/削除
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    const handleSetTheme = useCallback((newTheme: Theme) => {
        themeStore.setTheme(newTheme);
    }, [themeStore]);

    const value = useMemo(() => ({theme, setTheme: handleSetTheme, isDark}), [theme, isDark, handleSetTheme]);

    return (
        <DarkModeContext.Provider value={value}>
            {children}
        </DarkModeContext.Provider>
    );
}

export function useDarkMode() {
    const context = useContext(DarkModeContext);
    if (context === undefined) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
}
