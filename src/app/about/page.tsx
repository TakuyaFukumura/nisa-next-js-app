import Link from 'next/link';
import {loadNisaData} from '../../../lib/csvLoader';

export default function AboutPage() {
    const records = loadNisaData();
    const latestYear = records.length > 0 ? Math.max(...records.map((record) => record.year)) : null;

    return (
        <div
            className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4 lg:p-6">
            <main className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                    解説
                </h1>

                <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        このアプリについて
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        NISAの投資額をグラフや表で確認できるアプリです。生涯・年ごとの利用状況を、つみたて投資枠と成長投資枠に分けて表示します。
                    </p>
                </section>

                <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        各画面の説明
                    </h2>
                    <div className="space-y-5">
                        <article>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
                                    全体
                                </Link>
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                生涯投資枠1,800万円に対する利用済み額・残り枠・利用率と、枠ごとの内訳を確認できます。
                            </p>
                        </article>
                        <article>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                <Link href="/yearly" className="text-blue-600 dark:text-blue-400 hover:underline">
                                    年別一覧
                                </Link>
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                年ごとの投資額をグラフと表で確認できます。表の年を選ぶと、その年の内訳を表示します。
                            </p>
                        </article>
                        <article>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                                {latestYear === null ? (
                                    '年別詳細'
                                ) : (
                                    <Link
                                        href={`/yearly/${latestYear}`}
                                        className="text-blue-600 dark:text-blue-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                                    >
                                        年別詳細
                                    </Link>
                                )}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                選択した年のつみたて投資枠・成長投資枠について、利用済み額や年間上限に対する利用率、残り枠を確認できます。左右の矢印で年を切り替えられます。
                            </p>
                        </article>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        表示データについて
                    </h2>
                    <p
                        role="note"
                        className="mb-3 rounded-lg bg-amber-50 dark:bg-amber-900/30 px-3 py-2 text-sm font-medium text-amber-800 dark:text-amber-200"
                    >
                        ※表示されているデータはサンプルです。
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        投資額は登録された年別データをもとに集計しています。表示内容は記録された金額の確認用であり、投資助言を行うものではありません。
                    </p>
                </section>
            </main>
        </div>
    );
}
