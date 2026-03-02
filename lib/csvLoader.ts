import fs from 'fs';
import path from 'path';

export type NisaRecord = {
    year: number;
    tsumitateAmount: number;
    growthAmount: number;
};

export function loadNisaData(): NisaRecord[] {
    const csvPath = path.join(process.cwd(), 'data', 'nisa.csv');
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.replace(/\r/g, '').trim().split('\n');
    // ヘッダー行をスキップ
    return lines.slice(1).filter((line) => line.trim() !== '').map((line) => {
        const [year, tsumitate_amount, growth_amount] = line.split(',');
        return {
            year: parseInt(year, 10),
            tsumitateAmount: parseInt(tsumitate_amount, 10),
            growthAmount: parseInt(growth_amount, 10),
        };
    });
}
