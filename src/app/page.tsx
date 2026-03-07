import Link from 'next/link';
import {loadNisaData} from '../../lib/csvLoader';
import {formatAmount, GROWTH_LIFETIME_LIMIT, NISA_TOTAL_LIMIT, TSUMITATE_LIFETIME_LIMIT} from '../../lib/nisaConstants';
import NisaCategoryChart from './components/NisaCategoryChart';
import NisaOverallChart from './components/NisaOverallChart';

export default function Home() {
    const records = loadNisaData();
    const {tsumitateUsed, growthUsed} = records.reduce(
        (acc, r) => {
            acc.tsumitateUsed += r.tsumitateAmount;
            acc.growthUsed += r.growthAmount;
            return acc;
        },
        {tsumitateUsed: 0, growthUsed: 0},
    );
    const usedAmount = tsumitateUsed + growthUsed;
    const remainingAmount = Math.max(0, NISA_TOTAL_LIMIT - usedAmount);
    const usageRate = NISA_TOTAL_LIMIT > 0 ? (usedAmount / NISA_TOTAL_LIMIT) * 100 : 0;

    return (
        <div
            className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4 lg:p-6">
            <main className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                    NISA利用状況
                </h1>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-3 sm:p-6 mb-4 sm:mb-6">
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

                    {/* 種別別 生涯投資枠 利用状況 */}
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">
                            種別別 生涯投資枠 利用状況
                        </h3>
                        <NisaCategoryChart
                            label="つみたて投資枠"
                            usedAmount={tsumitateUsed}
                            lifetimeLimit={TSUMITATE_LIFETIME_LIMIT}
                            textColorClass="text-blue-500"
                            bgColorClass="bg-blue-500"
                        />
                        <NisaCategoryChart
                            label="成長投資枠"
                            usedAmount={growthUsed}
                            lifetimeLimit={GROWTH_LIFETIME_LIMIT}
                            textColorClass="text-green-500"
                            bgColorClass="bg-green-500"
                        />
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
