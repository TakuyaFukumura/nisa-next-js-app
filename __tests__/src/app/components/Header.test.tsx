/**
 * Header コンポーネントのテスト
 *
 * このテストファイルは、src/app/components/Header.tsxの機能をテストします。
 * ダークモード/ライトモードの切り替えボタンとヘッダーの表示をテストしています。
 */

import React from 'react';
import {fireEvent, render, screen, within} from '@testing-library/react';
import {DarkModeProvider} from '@/app/components/DarkModeProvider';
import Header from '../../../../src/app/components/Header';
import '@testing-library/jest-dom';

// next/navigation の usePathname をモック
const mockUsePathname = jest.fn();
jest.mock('next/navigation', () => ({
    usePathname: () => mockUsePathname(),
}));

describe('Header', () => {
    beforeEach(() => {
        mockUsePathname.mockReturnValue('/');
    });

    const renderWithProvider = (initialTheme?: 'light' | 'dark', latestYear: number | null = 2026) => {
        if (initialTheme) {
            window.localStorage.getItem = jest.fn(() => initialTheme);
        }

        return render(
            <DarkModeProvider>
                <Header latestYear={latestYear}/>
            </DarkModeProvider>
        );
    };

    describe('基本的なレンダリング', () => {
        it('ヘッダータイトルが表示される', () => {
            renderWithProvider();

            expect(screen.getByText('nisa')).toBeInTheDocument();
        });

        it('ヘッダーのHTML構造が正しい', () => {
            renderWithProvider();

            const header = screen.getByRole('banner');
            expect(header).toBeInTheDocument();
            expect(header.tagName).toBe('HEADER');
        });

        it('テーマ切り替えボタンが表示される', () => {
            renderWithProvider();

            const button = screen.getByTitle(/現在:/);
            expect(button).toBeInTheDocument();
        });

        it('ハンバーガーボタンが表示される', () => {
            renderWithProvider();

            const button = screen.getByRole('button', {name: 'メニューを開く'});
            expect(button).toBeInTheDocument();
        });
    });

    describe('ナビゲーションリンク', () => {
        it('全体リンクが表示される', () => {
            renderWithProvider();

            expect(screen.getByRole('link', {name: '全体'})).toBeInTheDocument();
        });

        it('年別リンクが表示される', () => {
            renderWithProvider();

            expect(screen.getByRole('link', {name: '年別'})).toBeInTheDocument();
        });

        it('NISA内訳リンクが表示される', () => {
            renderWithProvider();

            expect(screen.getByRole('link', {name: 'NISA内訳'})).toBeInTheDocument();
        });

        it('全体リンクのhrefが正しい', () => {
            renderWithProvider();

            const link = screen.getByRole('link', {name: '全体'});
            expect(link).toHaveAttribute('href', '/');
        });

        it('年別リンクのhrefが正しい', () => {
            renderWithProvider();

            const link = screen.getByRole('link', {name: '年別'});
            expect(link).toHaveAttribute('href', '/yearly');
        });

        it('NISA内訳リンクのhrefが正しい', () => {
            renderWithProvider();

            const link = screen.getByRole('link', {name: 'NISA内訳'});
            expect(link).toHaveAttribute('href', '/yearly/2026');
        });

        it('現在のパスが / の場合、全体リンクがアクティブ状態になる', () => {
            mockUsePathname.mockReturnValue('/');
            renderWithProvider();

            const activeLink = screen.getByRole('link', {name: '全体'});
            expect(activeLink).toHaveClass('bg-blue-100');
        });

        it('現在のパスが /yearly の場合、年別リンクがアクティブ状態になる', () => {
            mockUsePathname.mockReturnValue('/yearly');
            renderWithProvider();

            const activeLink = screen.getByRole('link', {name: '年別'});
            expect(activeLink).toHaveClass('bg-blue-100');
        });

        it('現在のパスが /yearly/2024 の場合、年別リンクはアクティブ状態にならない', () => {
            mockUsePathname.mockReturnValue('/yearly/2024');
            renderWithProvider();

            const inactiveLink = screen.getByRole('link', {name: '年別'});
            expect(inactiveLink).not.toHaveClass('bg-blue-100');
        });

        it('現在のパスが /yearly/2024 の場合、NISA内訳リンクがアクティブ状態になる', () => {
            mockUsePathname.mockReturnValue('/yearly/2024');
            renderWithProvider();

            const activeLink = screen.getByRole('link', {name: 'NISA内訳'});
            expect(activeLink).toHaveClass('bg-blue-100');
        });

        it('現在のパスが /yearly/2026 の場合、NISA内訳リンクがアクティブ状態になる', () => {
            mockUsePathname.mockReturnValue('/yearly/2026');
            renderWithProvider();

            const activeLink = screen.getByRole('link', {name: 'NISA内訳'});
            expect(activeLink).toHaveClass('bg-blue-100');
        });

        it('現在のパスが / の場合、NISA内訳リンクはアクティブ状態にならない', () => {
            mockUsePathname.mockReturnValue('/');
            renderWithProvider();

            const inactiveLink = screen.getByRole('link', {name: 'NISA内訳'});
            expect(inactiveLink).not.toHaveClass('bg-blue-100');
        });

        it('現在のパスが / の場合、年別リンクはアクティブ状態にならない', () => {
            mockUsePathname.mockReturnValue('/');
            renderWithProvider();

            const inactiveLink = screen.getByRole('link', {name: '年別'});
            expect(inactiveLink).not.toHaveClass('bg-blue-100');
        });

        it('latestYear が null の場合、NISA内訳リンクが表示されない', () => {
            renderWithProvider(undefined, null);

            expect(screen.queryByRole('link', {name: 'NISA内訳'})).not.toBeInTheDocument();
        });
    });

    describe('ライトモード', () => {
        it('ライトモード時に太陽アイコンが表示される', () => {
            renderWithProvider('light');

            expect(screen.getByText('☀️')).toBeInTheDocument();
        });

        it('ライトモード時のラベルが表示される', () => {
            renderWithProvider('light');

            expect(screen.getByText('ライトモード')).toBeInTheDocument();
        });

        it('ボタンのtitle属性が正しく設定される', () => {
            renderWithProvider('light');

            const button = screen.getByTitle('現在: ライトモード');
            expect(button).toHaveAttribute('title', '現在: ライトモード');
        });
    });

    describe('ダークモード', () => {
        it('ダークモード時に月アイコンが表示される', () => {
            window.localStorage.setItem('theme', 'dark');
            renderWithProvider();

            expect(screen.getByText('🌙')).toBeInTheDocument();
        });

        it('ダークモード時のラベルが表示される', () => {
            window.localStorage.setItem('theme', 'dark');
            renderWithProvider();

            expect(screen.getByText('ダークモード')).toBeInTheDocument();
        });

        it('ボタンのtitle属性が正しく設定される', () => {
            renderWithProvider('dark');

            const button = screen.getByTitle('現在: ダークモード');
            expect(button).toHaveAttribute('title', '現在: ダークモード');
        });
    });

    describe('テーマ切り替え機能', () => {
        it('ライトモードからダークモードに切り替わる', () => {
            window.localStorage.setItem('theme', 'light');
            renderWithProvider();

            // 初期状態の確認
            expect(screen.getByText('☀️')).toBeInTheDocument();
            expect(screen.getByText('ライトモード')).toBeInTheDocument();

            // ボタンをクリック
            const button = screen.getByTitle(/現在:/);
            fireEvent.click(button);

            // ダークモードに変更されたことを確認
            expect(screen.getByText('🌙')).toBeInTheDocument();
            expect(screen.getByText('ダークモード')).toBeInTheDocument();
        });

        it('ダークモードからライトモードに切り替わる', () => {
            renderWithProvider('dark');

            // 初期状態の確認
            expect(screen.getByText('🌙')).toBeInTheDocument();
            expect(screen.getByText('ダークモード')).toBeInTheDocument();

            // ボタンをクリック
            const button = screen.getByTitle(/現在:/);
            fireEvent.click(button);

            // ライトモードに変更されたことを確認
            expect(screen.getByText('☀️')).toBeInTheDocument();
            expect(screen.getByText('ライトモード')).toBeInTheDocument();
        });

        it('複数回のクリックで正しく切り替わる', () => {
            renderWithProvider('light');

            const button = screen.getByTitle(/現在:/);

            // ライトモード → ダークモード
            fireEvent.click(button);
            expect(screen.getByText('🌙')).toBeInTheDocument();

            // ダークモード → ライトモード
            fireEvent.click(button);
            expect(screen.getByText('☀️')).toBeInTheDocument();

            // ライトモード → ダークモード
            fireEvent.click(button);
            expect(screen.getByText('🌙')).toBeInTheDocument();
        });
    });

    describe('ボタンのアクセシビリティ', () => {
        it('テーマ切り替えボタンがキーボードでアクセス可能', () => {
            renderWithProvider();

            const button = screen.getByTitle(/現在:/);
            expect(button).toBeInTheDocument();

            // タブキーでフォーカス可能かを確認
            button.focus();
            expect(button).toHaveFocus();
        });

        it('ハンバーガーボタンがキーボードでアクセス可能', () => {
            renderWithProvider();

            const button = screen.getByRole('button', {name: 'メニューを開く'});
            expect(button).toBeInTheDocument();

            button.focus();
            expect(button).toHaveFocus();
        });

        it('ハンバーガーボタンに aria-expanded が設定されている', () => {
            renderWithProvider();

            const button = screen.getByRole('button', {name: 'メニューを開く'});
            expect(button).toHaveAttribute('aria-expanded', 'false');
        });

        it('ハンバーガーボタンに aria-controls が設定されている', () => {
            renderWithProvider();

            const button = screen.getByRole('button', {name: 'メニューを開く'});
            // 閉じている間は aria-controls を付与しない
            expect(button).not.toHaveAttribute('aria-controls');

            // 開いたときに aria-controls="mobile-menu" が付与される
            fireEvent.click(button);
            expect(screen.getByRole('button', {name: 'メニューを閉じる'})).toHaveAttribute('aria-controls', 'mobile-menu');
        });

        it('適切なaria属性が設定されている', () => {
            renderWithProvider();

            const button = screen.getByTitle(/現在:/);

            // title属性による説明があることを確認
            expect(button).toHaveAttribute('title');
            expect(button.getAttribute('title')).toContain('現在:');
        });
    });

    describe('ハンバーガーメニューの動作', () => {
        it('ハンバーガーボタン押下でドロワーが表示される', () => {
            renderWithProvider();

            // 初期状態ではドロワー非表示（mobile-menu が DOM に存在しないことを確認）
            expect(document.getElementById('mobile-menu')).toBeNull();

            // ボタンをクリック
            const button = screen.getByRole('button', {name: 'メニューを開く'});
            fireEvent.click(button);

            // ドロワーが表示される
            expect(document.getElementById('mobile-menu')).toBeInTheDocument();
        });

        it('ハンバーガーボタン再クリックでドロワーが非表示になる', () => {
            renderWithProvider();

            const button = screen.getByRole('button', {name: 'メニューを開く'});

            // 開く
            fireEvent.click(button);
            expect(document.getElementById('mobile-menu')).toBeInTheDocument();

            // 再クリックで閉じる
            fireEvent.click(screen.getByRole('button', {name: 'メニューを閉じる'}));
            expect(document.getElementById('mobile-menu')).not.toBeInTheDocument();
        });

        it('ドロワー開閉で aria-label が切り替わる', () => {
            renderWithProvider();

            const button = screen.getByRole('button', {name: 'メニューを開く'});
            expect(button).toHaveAttribute('aria-expanded', 'false');

            fireEvent.click(button);

            const openButton = screen.getByRole('button', {name: 'メニューを閉じる'});
            expect(openButton).toHaveAttribute('aria-expanded', 'true');
        });

        it('ドロワー内リンクをクリックするとメニューが閉じる', () => {
            renderWithProvider();

            // ドロワーを開く
            fireEvent.click(screen.getByRole('button', {name: 'メニューを開く'}));
            expect(document.getElementById('mobile-menu')).toBeInTheDocument();

            // ドロワー内の「全体」リンクをクリック
            const mobileMenu = document.getElementById('mobile-menu')!;
            fireEvent.click(within(mobileMenu).getByRole('link', {name: '全体'}));

            // ドロワーが閉じる
            expect(document.getElementById('mobile-menu')).not.toBeInTheDocument();
        });

        it('メニュー外クリックでドロワーが閉じる', () => {
            renderWithProvider();

            // ドロワーを開く
            fireEvent.click(screen.getByRole('button', {name: 'メニューを開く'}));
            expect(document.getElementById('mobile-menu')).toBeInTheDocument();

            // ヘッダー外をクリック
            fireEvent.mouseDown(document.body);

            // ドロワーが閉じる
            expect(document.getElementById('mobile-menu')).not.toBeInTheDocument();
        });
    });

    describe('レスポンシブデザイン', () => {
        beforeEach(() => {
            window.localStorage.setItem('theme', 'light');
            renderWithProvider();
        });

        it('テキストラベルが適切なクラスで制御されている', () => {
            // 'hidden sm:inline' クラスでモバイルでは非表示になることを想定
            const textLabel = screen.getByText('ライトモード');
            expect(textLabel).toHaveClass('hidden', 'sm:inline');
        });

        it('アイコンが常に表示される', () => {

            const icon = screen.getByText('☀️');
            expect(icon).toBeInTheDocument();
        });
    });

    describe('CSS クラスの適用', () => {
        it('ヘッダーに適切なスタイルクラスが適用される', () => {
            renderWithProvider();

            const header = screen.getByRole('banner');
            expect(header).toHaveClass('bg-white/80', 'dark:bg-gray-800/80');
        });

        it('テーマ切り替えボタンに適切なスタイルクラスが適用される', () => {
            renderWithProvider();

            const button = screen.getByTitle(/現在:/);
            expect(button).toHaveClass('flex', 'items-center', 'gap-2');
        });
    });
});

