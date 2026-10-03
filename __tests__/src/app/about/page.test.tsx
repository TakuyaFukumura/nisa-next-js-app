import {render, screen} from '@testing-library/react';
import AboutPage from '@/app/about/page';
import {loadNisaData} from '../../../../lib/csvLoader';

describe('AboutPage', () => {
    it('最新年の年別詳細画面へのリンクを表示する', () => {
        const records = loadNisaData();
        const latestYear = Math.max(...records.map((record) => record.year));

        render(<AboutPage/>);

        expect(screen.getByRole('link', {name: '年別詳細'})).toHaveAttribute('href', `/yearly/${latestYear}`);
    });
});
