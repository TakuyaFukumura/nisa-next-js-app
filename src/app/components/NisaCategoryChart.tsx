'use client';

import {formatAmount} from '../../../lib/nisaConstants';

type Props = {
    readonly label: string;
    readonly usedAmount: number;
    readonly lifetimeLimit: number;
    readonly textColorClass: string;
    readonly bgColorClass: string;
};

export default function NisaCategoryChart({label, usedAmount, lifetimeLimit, textColorClass, bgColorClass}: Props) {
    const remainingAmount = Math.max(0, lifetimeLimit - usedAmount);
    const usageRate = lifetimeLimit > 0 ? (usedAmount / lifetimeLimit) * 100 : 0;

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                <span className={`text-sm font-semibold ${textColorClass}`}>{usageRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-1">
                <div
                    className={`h-3 rounded-full ${bgColorClass}`}
                    style={{width: `${Math.min(100, usageRate)}%`}}
                />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
                利用済み: {formatAmount(usedAmount)} / {formatAmount(lifetimeLimit)}
                （残り {formatAmount(remainingAmount)}）
            </div>
        </div>
    );
}
