import Link from 'next/link';
import {loadNisaData} from '../../../lib/csvLoader';
import {GROWTH_LIFETIME_LIMIT, TSUMITATE_LIFETIME_LIMIT} from '../../../lib/nisaConstants';
import NisaCategoryChart from '../components/NisaCategoryChart';

export default function BreakdownPage() {
    const records = loadNisaData();
    const {tsumitateUsed, growthUsed} = records.reduce(
        (acc, r) => ({
            tsumitateUsed: acc.tsumitateUsed + r.tsumitateAmount,
            growthUsed: acc.growthUsed + r.growthAmount,
        }),
        {tsumitateUsed: 0, growthUsed: 0},
    );

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4 lg:p-6">
            <main className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                    NISA内訳
                </h1>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-3 sm:p-6 mb-4 sm:mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        種別別 生涯投資枠 利用状況
                    </h2>
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
