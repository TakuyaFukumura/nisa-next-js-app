/**
 * CSVローダーのテスト
 *
 * このテストファイルは、lib/csvLoader.tsの機能をテストします。
 */

import fs from 'fs';

// fsモジュールをモック
jest.mock('fs');
let mockReadFileSync: jest.MockedFunction<typeof fs.readFileSync>;

describe('csvLoader', () => {
    beforeEach(() => {
        jest.resetModules();
        const mockFs = jest.requireMock('fs') as typeof fs;
        mockReadFileSync = mockFs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('loadNisaData', () => {
        it('CSVファイルを正しく読み込んでNisaRecord配列を返す', async () => {
            mockReadFileSync.mockReturnValue(
                'year,tsumitate_amount,growth_amount\n2024,400000,2400000\n2025,400000,2400000\n'
            );

            const {loadNisaData} = await import('../../lib/csvLoader');
            const records = loadNisaData();

            expect(records).toHaveLength(2);
            expect(records[0]).toEqual({
                year: 2024,
                tsumitateAmount: 400000,
                growthAmount: 2400000,
            });
            expect(records[1]).toEqual({
                year: 2025,
                tsumitateAmount: 400000,
                growthAmount: 2400000,
            });
        });

        it('1行のデータを正しく読み込む', async () => {
            mockReadFileSync.mockReturnValue(
                'year,tsumitate_amount,growth_amount\n2024,1200000,2400000\n'
            );

            const {loadNisaData} = await import('../../lib/csvLoader');
            const records = loadNisaData();

            expect(records).toHaveLength(1);
            expect(records[0]).toEqual({
                year: 2024,
                tsumitateAmount: 1200000,
                growthAmount: 2400000,
            });
        });

        it('数値が正しくパースされる', async () => {
            mockReadFileSync.mockReturnValue(
                'year,tsumitate_amount,growth_amount\n2024,400000,2400000\n'
            );

            const {loadNisaData} = await import('../../lib/csvLoader');
            const records = loadNisaData();

            expect(typeof records[0].year).toBe('number');
            expect(typeof records[0].tsumitateAmount).toBe('number');
            expect(typeof records[0].growthAmount).toBe('number');
        });

        it('空のCSV（ヘッダーのみ）の場合は空配列を返す', async () => {
            mockReadFileSync.mockReturnValue('year,tsumitate_amount,growth_amount\n');

            const {loadNisaData} = await import('../../lib/csvLoader');
            const records = loadNisaData();

            expect(records).toHaveLength(0);
        });

        it('CRLF行末のCSVを正しく読み込む', async () => {
            mockReadFileSync.mockReturnValue(
                'year,tsumitate_amount,growth_amount\r\n2024,400000,2400000\r\n2025,400000,2400000\r\n'
            );

            const {loadNisaData} = await import('../../lib/csvLoader');
            const records = loadNisaData();

            expect(records).toHaveLength(2);
            expect(records[0]).toEqual({
                year: 2024,
                tsumitateAmount: 400000,
                growthAmount: 2400000,
            });
        });

        it('不正な行（カラム不足）の場合にエラーをスローする', async () => {
            mockReadFileSync.mockReturnValue(
                'year,tsumitate_amount,growth_amount\n2024,400000\n'
            );

            const {loadNisaData} = await import('../../lib/csvLoader');

            expect(() => loadNisaData()).toThrow('Invalid CSV data');
        });
    });
});
