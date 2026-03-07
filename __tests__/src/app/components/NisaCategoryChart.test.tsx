/**
 * NisaCategoryChart コンポーネントのテスト
 *
 * このテストファイルは、src/app/components/NisaCategoryChart.tsx の機能をテストします。
 * 種別別生涯投資枠の利用状況表示（プログレスバー・利用率・金額）をテストしています。
 */

import React from 'react';
import {render, screen} from '@testing-library/react';
import NisaCategoryChart from '../../../../src/app/components/NisaCategoryChart';
import '@testing-library/jest-dom';

describe('NisaCategoryChart', () => {
    const defaultProps = {
        label: 'つみたて投資枠',
        usedAmount: 3000000,
        lifetimeLimit: 6000000,
        textColorClass: 'text-blue-500',
        bgColorClass: 'bg-blue-500',
    };

    describe('基本的なレンダリング', () => {
        it('ラベルが表示される', () => {
            render(<NisaCategoryChart {...defaultProps} />);

            expect(screen.getByText('つみたて投資枠')).toBeInTheDocument();
        });

        it('利用率が正しく表示される', () => {
            render(<NisaCategoryChart {...defaultProps} />);

            // 3,000,000 / 6,000,000 = 50.0%
            expect(screen.getByText('50.0%')).toBeInTheDocument();
        });

        it('利用済み金額・生涯上限・残り枠が表示される', () => {
            render(<NisaCategoryChart {...defaultProps} />);

            expect(screen.getByText(/利用済み:/)).toBeInTheDocument();
            expect(screen.getByText(/3,000,000円/)).toBeInTheDocument();
            expect(screen.getByText(/6,000,000円/)).toBeInTheDocument();
            expect(screen.getByText(/残り 3,000,000円/)).toBeInTheDocument();
        });
    });

    describe('プログレスバーのスタイル', () => {
        it('バーに指定した bgColorClass が適用される', () => {
            const {container} = render(<NisaCategoryChart {...defaultProps} />);

            const bar = container.querySelector('.bg-blue-500');
            expect(bar).toBeInTheDocument();
        });

        it('利用率に応じた幅がスタイルに設定される', () => {
            const {container} = render(<NisaCategoryChart {...defaultProps} />);

            const bar = container.querySelector('.bg-blue-500');
            expect(bar).toHaveStyle({width: '50%'});
        });

        it('利用率が100%を超えてもバー幅は100%に制限される', () => {
            const {container} = render(
                <NisaCategoryChart
                    {...defaultProps}
                    usedAmount={9000000}
                    lifetimeLimit={6000000}
                />,
            );

            const bar = container.querySelector('.bg-blue-500');
            expect(bar).toHaveStyle({width: '100%'});
            expect(screen.getByText('100.0%')).toBeInTheDocument();
        });
    });

    describe('エッジケース', () => {
        it('利用済み金額が0円のとき利用率は0.0%と表示される', () => {
            render(<NisaCategoryChart {...defaultProps} usedAmount={0} />);

            expect(screen.getByText('0.0%')).toBeInTheDocument();
            expect(screen.getByText(/残り 6,000,000円/)).toBeInTheDocument();
        });

        it('生涯上限が0のとき利用率は0.0%と表示される', () => {
            render(<NisaCategoryChart {...defaultProps} usedAmount={0} lifetimeLimit={0} />);

            expect(screen.getByText('0.0%')).toBeInTheDocument();
        });

        it('利用済み金額が生涯上限と等しいとき残り枠は0円と表示される', () => {
            render(<NisaCategoryChart {...defaultProps} usedAmount={6000000} />);

            expect(screen.getByText('100.0%')).toBeInTheDocument();
            expect(screen.getByText(/残り 0円/)).toBeInTheDocument();
        });

        it('利用済み金額が生涯上限を超えても残り枠は0円と表示される', () => {
            render(<NisaCategoryChart {...defaultProps} usedAmount={7000000} />);

            expect(screen.getByText(/残り 0円/)).toBeInTheDocument();
        });
    });

    describe('textColorClass の適用', () => {
        it('利用率テキストに指定した textColorClass が適用される', () => {
            render(<NisaCategoryChart {...defaultProps} textColorClass="text-green-500" />);

            const rateText = screen.getByText('50.0%');
            expect(rateText).toHaveClass('text-green-500');
        });
    });
});
