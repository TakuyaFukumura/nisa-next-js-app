'use client';

import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {formatAmount} from '../../../lib/nisaConstants';

type Props = {
    readonly title: string;
    readonly usedAmount: number;
    readonly limit: number;
    readonly colors: [string, string];
};

export default function NisaYearlyDetailChart({title, usedAmount, limit, colors}: Props) {
    const remainingAmount = Math.max(0, limit - usedAmount);
    const usageRate = limit > 0 ? (usedAmount / limit) * 100 : 0;

    const data = [
        {name: '利用済み', value: usedAmount},
        {name: '残り枠', value: remainingAmount},
    ];

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="value"
                        label={({name, value}) => `${name}: ${formatAmount(value)}`}
                    >
                        {data.map((_entry, index) => (
                            <Cell key={`cell-${data[index].name}`} fill={colors[index % colors.length]}/>
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatAmount(value)}/>
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
            <div className="text-center text-xl font-bold mt-1" style={{color: colors[0]}}>
                {usageRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                <div>利用済み: {formatAmount(usedAmount)}</div>
                <div>残り枠: {formatAmount(remainingAmount)}</div>
            </div>
        </div>
    );
}
