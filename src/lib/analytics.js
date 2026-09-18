const DAY_MS = 24 * 60 * 60 * 1000;

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Safely convert a value to a number.
 */
function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

/**
 * Convert a date value into a timestamp.
 */
function toTimestamp(value) {
  const timestamp = new Date(value).getTime();

  return Number.isFinite(timestamp) ? timestamp : 0;
}

/**
 * Calculate percentage change between two values.
 *
 * If the previous value is zero and the current value is positive,
 * we return 100 because there is no meaningful finite percentage.
 */
function percentageChange(current, previous) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return ((current - previous) / previous) * 100;
}

/**
 * Return only completed sales.
 */
function getCompletedSales(sales) {
  return sales.filter((sale) => sale.status === 'completed');
}

/**
 * Calculate the main business statistics.
 */
export function computeStats(
  sales = [],
  customers = [],
  products = []
) {
  const completedSales = getCompletedSales(sales);

  const totalRevenue = completedSales.reduce(
    (sum, sale) => sum + toNumber(sale.total),
    0
  );

  const totalOrders = completedSales.length;

  const avgOrderValue =
    totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const lowStockCount = products.filter(
    (product) => toNumber(product.stock) <= 5
  ).length;

  const now = Date.now();
  const thirtyDaysAgo = now - 30 * DAY_MS;
  const sixtyDaysAgo = now - 60 * DAY_MS;

  const recentSales = completedSales.filter(
    (sale) => toTimestamp(sale.saleDate) >= thirtyDaysAgo
  );

  const previousSales = completedSales.filter((sale) => {
    const timestamp = toTimestamp(sale.saleDate);

    return (
      timestamp >= sixtyDaysAgo &&
      timestamp < thirtyDaysAgo
    );
  });

  const recentRevenue = recentSales.reduce(
    (sum, sale) => sum + toNumber(sale.total),
    0
  );

  const previousRevenue = previousSales.reduce(
    (sum, sale) => sum + toNumber(sale.total),
    0
  );

  const recentCustomers = customers.filter(
    (customer) => toTimestamp(customer.createdAt) >= thirtyDaysAgo
  );

  const previousCustomers = customers.filter((customer) => {
    const timestamp = toTimestamp(customer.createdAt);

    return (
      timestamp >= sixtyDaysAgo &&
      timestamp < thirtyDaysAgo
    );
  });

  return {
    totalRevenue,
    totalOrders,
    totalCustomers: customers.length,
    totalProducts: products.length,
    lowStockCount,
    avgOrderValue,

    revenueChange: percentageChange(
      recentRevenue,
      previousRevenue
    ),

    ordersChange: percentageChange(
      recentSales.length,
      previousSales.length
    ),

    customersChange: percentageChange(
      recentCustomers.length,
      previousCustomers.length
    ),
  };
}

/**
 * Calculate revenue for each of the last six calendar months.
 */
export function revenueByMonth(sales = []) {
  const now = new Date();
  const completedSales = getCompletedSales(sales);

  const result = [];

  for (let offset = 5; offset >= 0; offset -= 1) {
    const monthDate = new Date(
      now.getFullYear(),
      now.getMonth() - offset,
      1
    );

    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const revenue = completedSales
      .filter((sale) => {
        const saleDate = new Date(sale.saleDate);

        return (
          saleDate.getFullYear() === year &&
          saleDate.getMonth() === month
        );
      })
      .reduce(
        (sum, sale) => sum + toNumber(sale.total),
        0
      );

    result.push({
      month: MONTHS[month],
      revenue: Math.round(revenue),
    });
  }

  return result;
}

/**
 * Calculate completed sales revenue grouped by product category.
 */
export function salesByCategory(
  sales = [],
  products = []
) {
  const categoryRevenue = new Map();

  const productMap = new Map(
    products.map((product) => [product.id, product])
  );

  for (const sale of getCompletedSales(sales)) {
    const product = productMap.get(sale.productId);
    const category = product?.category || 'Uncategorized';

    const currentRevenue =
      categoryRevenue.get(category) || 0;

    categoryRevenue.set(
      category,
      currentRevenue + toNumber(sale.total)
    );
  }

  return Array.from(categoryRevenue.entries())
    .map(([name, value]) => ({
      name,
      value: Math.round(value),
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Return the top products based on completed-sale revenue.
 */
export function topProducts(
  sales = [],
  products = [],
  limit = 5
) {
  const productMap = new Map(
    products.map((product) => [product.id, product])
  );

  const productSales = new Map();

  for (const sale of getCompletedSales(sales)) {
    const productId = sale.productId;

    const existing = productSales.get(productId) || {
      revenue: 0,
      quantity: 0,
    };

    productSales.set(productId, {
      revenue:
        existing.revenue + toNumber(sale.total),

      quantity:
        existing.quantity + toNumber(sale.quantity),
    });
  }

  return Array.from(productSales.entries())
    .map(([productId, data]) => {
      const product = productMap.get(productId);

      return {
        name: product?.name || 'Deleted product',
        ...data,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, Math.max(0, limit));
}

/**
 * Return the most recent sales with product and customer names.
 */
export function recentSales(
  sales = [],
  products = [],
  customers = [],
  limit = 5
) {
  const productMap = new Map(
    products.map((product) => [product.id, product])
  );

  const customerMap = new Map(
    customers.map((customer) => [customer.id, customer])
  );

  return [...sales]
    .sort(
      (a, b) =>
        toTimestamp(b.saleDate) -
        toTimestamp(a.saleDate)
    )
    .slice(0, Math.max(0, limit))
    .map((sale) => ({
      ...sale,

      productName:
        productMap.get(sale.productId)?.name ||
        'Deleted product',

      customerName:
        customerMap.get(sale.customerId)?.name ||
        'Walk-in',
    }));
}