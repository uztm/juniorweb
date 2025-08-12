// utils/formatMoney.ts
export function formatMoney(amount: number): string {
    if (amount >= 1_000_000) {
      return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    }
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  