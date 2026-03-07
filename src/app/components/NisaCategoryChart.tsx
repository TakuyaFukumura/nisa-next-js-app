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
    const clampedUsageRate = Math.min(100, Math.max(0, usageRate));

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                <span className={`text-sm font-semibold ${textColorClass}`}>{clampedUsageRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-1">
                <div
                    className={`h-3 rounded-full ${bgColorClass}`}
                    style={{width: `${clampedUsageRate}%`}}
                    role="progressbar"
                    aria-valuenow={Math.min(lifetimeLimit, Math.max(0, usedAmount))}
                    aria-valuemin={0}
                    aria-valuemax={lifetimeLimit}
                    aria-label={label}
                />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
                利用済み: {formatAmount(usedAmount)} / {formatAmount(lifetimeLimit)}
                （残り {formatAmount(remainingAmount)}）
            </div>
        </div>
    );
}
