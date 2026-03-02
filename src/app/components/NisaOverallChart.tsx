'use client';

import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {formatAmount} from '../../../lib/nisaConstants';

type Props = {
    usedAmount: number;
    remainingAmount: number;
    usageRate: number;
};

const COLORS = ['#3b82f6', '#e5e7eb'];

export default function NisaOverallChart({usedAmount, remainingAmount, usageRate}: Props) {
    const data = [
        {name: '利用済み', value: usedAmount},
        {name: '残り枠', value: remainingAmount},
    ];

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        dataKey="value"
                        label={({name, value}) => `${name}: ${formatAmount(value)}`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatAmount(value)}/>
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
                {usageRate.toFixed(1)}% 利用済み
            </div>
        </div>
    );
}
