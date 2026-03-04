'use client';

import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import {NisaRecord} from '../../../lib/csvLoader';
import {formatAmount, YEARLY_TOTAL_LIMIT} from '../../../lib/nisaConstants';

type Props = {
    readonly data: NisaRecord[];
};

export default function NisaYearlyChart({data}: Props) {
    const chartData = data.map((d) => ({
        year: `${d.year}年`,
        つみたて投資枠: d.tsumitateAmount,
        成長投資枠: d.growthAmount,
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{top: 10, right: 10, left: 10, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="year"/>
                <YAxis tickFormatter={(v: number) => `${(v / 10000).toFixed(0)}万`}/>
                <Tooltip formatter={(value: number) => formatAmount(value)}/>
                <Legend/>
                <ReferenceLine
                    y={YEARLY_TOTAL_LIMIT}
                    stroke="#ef4444"
                    strokeDasharray="6 3"
                    label={{
                        value: `上限 ${formatAmount(YEARLY_TOTAL_LIMIT)}`,
                        position: 'insideTopLeft',
                        fill: '#ef4444',
                        fontSize: 11
                    }}
                />
                <Bar dataKey="つみたて投資枠" stackId="a" fill="#3b82f6"/>
                <Bar dataKey="成長投資枠" stackId="a" fill="#10b981"/>
            </BarChart>
        </ResponsiveContainer>
    );
}
