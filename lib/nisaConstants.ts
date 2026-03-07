export const NISA_TOTAL_LIMIT = 18000000;
export const TSUMITATE_YEARLY_LIMIT = 1200000;
export const GROWTH_YEARLY_LIMIT = 2400000;
export const YEARLY_TOTAL_LIMIT = 3600000;
export const TSUMITATE_LIFETIME_LIMIT = 6000000;
export const GROWTH_LIFETIME_LIMIT = 12000000;

export function formatAmount(amount: number): string {
    return amount.toLocaleString('ja-JP') + '円';
}
