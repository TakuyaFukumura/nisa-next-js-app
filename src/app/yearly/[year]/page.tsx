import {notFound} from 'next/navigation';
import Link from 'next/link';
import {loadNisaData} from '../../../../lib/csvLoader';
import {formatAmount, GROWTH_YEARLY_LIMIT, TSUMITATE_YEARLY_LIMIT} from '../../../../lib/nisaConstants';
import NisaYearlyDetailChart from '../../components/NisaYearlyDetailChart';

type Props = {
    readonly params: Promise<{ year: string }>;
};

export default async function YearDetailPage({params}: Props) {
    const {year} = await params;
    const yearNum = parseInt(year, 10);

    if (isNaN(yearNum)) {
        notFound();
    }

    const records = loadNisaData();
    const record = records.find((r) => r.year === yearNum);

    if (!record) {
        notFound();
    }

    const tsumitateRate = (record.tsumitateAmount / TSUMITATE_YEARLY_LIMIT) * 100;
    const growthRate = (record.growthAmount / GROWTH_YEARLY_LIMIT) * 100;

    return (
        <div
            className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <main className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                    {yearNum}年 NISA内訳
                </h1>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <NisaYearlyDetailChart
                            title="つみたて投資枠"
                            usedAmount={record.tsumitateAmount}
                            limit={TSUMITATE_YEARLY_LIMIT}
                            colors={['#3b82f6', '#e5e7eb']}
                        />
                        <NisaYearlyDetailChart
                            title="成長投資枠"
                            usedAmount={record.growthAmount}
                            limit={GROWTH_YEARLY_LIMIT}
                            colors={['#10b981', '#e5e7eb']}
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">サマリー</h2>
                    <div className="space-y-3 text-sm">
                        <div
                            className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400">つみたて投資枠</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                                利用済み {formatAmount(record.tsumitateAmount)} / 上限 {formatAmount(TSUMITATE_YEARLY_LIMIT)}（{tsumitateRate.toFixed(1)}%）
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 dark:text-gray-400">成長投資枠</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                                利用済み {formatAmount(record.growthAmount)} / 上限 {formatAmount(GROWTH_YEARLY_LIMIT)}（{growthRate.toFixed(1)}%）
                            </span>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        href="/yearly"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                        ← 年別利用状況に戻る
                    </Link>
                </div>
            </main>
        </div>
    );
}
