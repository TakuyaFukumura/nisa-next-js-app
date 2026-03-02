import Link from 'next/link';
import {loadNisaData} from '../../lib/csvLoader';
import {formatAmount, NISA_TOTAL_LIMIT} from '../../lib/nisaConstants';
import NisaOverallChart from './components/NisaOverallChart';

export default function Home() {
    const records = loadNisaData();
    const usedAmount = records.reduce((sum, r) => sum + r.tsumitateAmount + r.growthAmount, 0);
    const remainingAmount = Math.max(0, NISA_TOTAL_LIMIT - usedAmount);
    const usageRate = (usedAmount / NISA_TOTAL_LIMIT) * 100;

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <main className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                    NISA利用状況
                </h1>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        生涯投資枠 利用状況
                    </h2>

                    <NisaOverallChart
                        usedAmount={usedAmount}
                        remainingAmount={remainingAmount}
                        usageRate={usageRate}
                    />

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <div className="text-gray-500 dark:text-gray-400">生涯投資枠</div>
                            <div className="font-semibold text-gray-800 dark:text-gray-200">
                                {formatAmount(NISA_TOTAL_LIMIT)}
                            </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                            <div className="text-gray-500 dark:text-gray-400">利用済み合計</div>
                            <div className="font-semibold text-blue-600 dark:text-blue-400">
                                {formatAmount(usedAmount)}
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <div className="text-gray-500 dark:text-gray-400">残り枠</div>
                            <div className="font-semibold text-gray-800 dark:text-gray-200">
                                {formatAmount(remainingAmount)}
                            </div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3">
                            <div className="text-gray-500 dark:text-gray-400">利用率</div>
                            <div className="font-semibold text-green-600 dark:text-green-400">
                                {usageRate.toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        href="/yearly"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                        年別利用状況を見る →
                    </Link>
                </div>
            </main>
        </div>
    );
}
