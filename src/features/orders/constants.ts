export const MIN_ORDER_TOTAL = 500;

export const MIN_ORDER_TOTAL_MESSAGE = `সর্বনিম্ন অর্ডার মূল্য ৳${MIN_ORDER_TOTAL}`;

export const getMinOrderRemainingMessage = (total: number) =>
  total >= MIN_ORDER_TOTAL
    ? ""
    : `আরো ৳${MIN_ORDER_TOTAL - total} অর্ডার করতে হবে।`;
