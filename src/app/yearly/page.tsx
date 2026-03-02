import Link from 'next/link';
import {loadNisaData} from '../../../lib/csvLoader';
import {
    formatAmount,
    GROWTH_YEARLY_LIMIT,
    TSUMITATE_YEARLY_LIMIT,
    YEARLY_TOTAL_LIMIT
} from '../../../lib/nisaConstants';
import NisaYearlyChart from '../components/NisaYearlyChart';

export default function YearlyPage() {
    const records = loadNisaData();

    return (
        <div
            className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <main className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                    年別NISA利用状況
                </h1>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        年別投資額（積み上げ棒グラフ）
                    </h2>
                    <NisaYearlyChart data={records}/>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400">年</th>
                            <th className="text-right py-2 px-3 text-gray-600 dark:text-gray-400">つみたて投資枠</th>
                            <th className="text-right py-2 px-3 text-gray-600 dark:text-gray-400">成長投資枠</th>
                            <th className="text-right py-2 px-3 text-gray-600 dark:text-gray-400">合計</th>
                            <th className="text-right py-2 px-3 text-gray-600 dark:text-gray-400">利用率</th>
                            <th className="py-2 px-3"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {records.map((record) => {
                            const total = record.tsumitateAmount + record.growthAmount;
                            const usageRate = (total / YEARLY_TOTAL_LIMIT) * 100;
                            const tsumitateRate = (record.tsumitateAmount / TSUMITATE_YEARLY_LIMIT) * 100;
                            const growthRate = (record.growthAmount / GROWTH_YEARLY_LIMIT) * 100;
                            return (
                                <tr
                                    key={record.year}
                                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                >
                                    <td className="py-3 px-3 font-medium text-gray-800 dark:text-gray-200">
                                        {record.year}年
                                    </td>
                                    <td className="py-3 px-3 text-right text-gray-700 dark:text-gray-300">
                                        {formatAmount(record.tsumitateAmount)}
                                        <span className="text-xs text-gray-400 ml-1">
                                            ({tsumitateRate.toFixed(0)}%)
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-right text-gray-700 dark:text-gray-300">
                                        {formatAmount(record.growthAmount)}
                                        <span className="text-xs text-gray-400 ml-1">
                                            ({growthRate.toFixed(0)}%)
                                        </span>
                                    </td>
                                    <td className="py-3 px-3 text-right font-medium text-gray-800 dark:text-gray-200">
                                        {formatAmount(total)}
                                    </td>
                                    <td className="py-3 px-3 text-right text-blue-600 dark:text-blue-400 font-medium">
                                        {usageRate.toFixed(1)}%
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                        <Link
                                            href={`/yearly/${record.year}`}
                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                            aria-label={`${record.year}年の詳細を見る`}
                                        >
                                            →
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                <div className="text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                        ← 全体利用状況に戻る
                    </Link>
                </div>
            </main>
        </div>
    );
}
