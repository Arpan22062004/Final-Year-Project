import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, Package, Users, DollarSign, Target, Zap, Lightbulb, ArrowRight, } from 'lucide-react';
import Loading from '@/components/Loading';
import { getProducts, getCustomers, getSales } from '@/services/dataService';
import { computeStats, revenueByMonth, salesByCategory, topProducts, } from '@/lib/analytics';
import { formatCurrency } from '@/lib/utils';
export default function AIInsights() {
    const products = useMemo(() => getProducts(), []);
    const customers = useMemo(() => getCustomers(), []);
    const sales = useMemo(() => getSales(), []);
    const stats = useMemo(() => computeStats(sales, customers, products), [sales, customers, products]);
    const revData = useMemo(() => revenueByMonth(sales), [sales]);
    const catData = useMemo(() => salesByCategory(sales, products), [sales, products]);
    const topProductsData = useMemo(() => topProducts(sales, products, 3), [sales, products]);
    const insights = useMemo(() => {
        const result = [];
        // Revenue trend
        if (revData.length >= 2) {
            const last = revData[revData.length - 1];
            const prev = revData[revData.length - 2];
            if (last.revenue > prev.revenue) {
                result.push({
                    type: 'success',
                    icon: TrendingUp,
                    title: 'Revenue is accelerating',
                    description: `Revenue grew to ${formatCurrency(last.revenue)} this month, up from ${formatCurrency(prev.revenue)} last month. Keep the momentum going by doubling down on your top-performing channels.`,
                });
            }
            else if (last.revenue < prev.revenue) {
                result.push({
                    type: 'warning',
                    icon: TrendingDown,
                    title: 'Revenue dipped this month',
                    description: `Revenue dropped to ${formatCurrency(last.revenue)} from ${formatCurrency(prev.revenue)} last month. Consider running a promotion or reviewing your pricing strategy.`,
                });
            }
        }
        // Low stock
        const lowStock = products.filter((p) => p.stock <= 5);
        if (lowStock.length > 0) {
            result.push({
                type: 'warning',
                icon: AlertTriangle,
                title: `${lowStock.length} product${lowStock.length > 1 ? 's' : ''} need restocking`,
                description: `${lowStock.slice(0, 3).map((p) => p.name).join(', ')}${lowStock.length > 3 ? ' and more' : ''} ${lowStock.length > 1 ? 'are' : 'is'} running low. Reorder soon to avoid stockouts and lost revenue.`,
                action: { label: 'View products', to: '/products' },
            });
        }
        // Out of stock
        const outOfStock = products.filter((p) => p.stock === 0);
        if (outOfStock.length > 0) {
            result.push({
                type: 'warning',
                icon: Package,
                title: `${outOfStock.length} product${outOfStock.length > 1 ? 's are' : ' is'} out of stock`,
                description: `You're losing potential sales on ${outOfStock.slice(0, 2).map((p) => p.name).join(', ')}. Restock immediately or mark as discontinued.`,
                action: { label: 'View products', to: '/products' },
            });
        }
        // Top product
        if (topProductsData.length > 0) {
            result.push({
                type: 'opportunity',
                icon: Target,
                title: `${topProductsData[0].name} is your bestseller`,
                description: `Generating ${formatCurrency(topProductsData[0].revenue)} in revenue with ${topProductsData[0].quantity} units sold. Consider bundling it with slower-moving products or increasing its price.`,
            });
        }
        // Top category
        if (catData.length > 0) {
            result.push({
                type: 'info',
                icon: DollarSign,
                title: `${catData[0].name} is your top category`,
                description: `${catData[0].name} accounts for ${formatCurrency(catData[0].value)} in revenue. Expand your offerings in this category to capture more market share.`,
            });
        }
        // Avg order value
        if (stats.avgOrderValue > 0) {
            result.push({
                type: 'opportunity',
                icon: Zap,
                title: 'Increase your average order value',
                description: `Your average order is ${formatCurrency(stats.avgOrderValue)}. Offer volume discounts or product bundles to encourage customers to spend more per transaction.`,
            });
        }
        // Customer growth
        if (stats.customersChange > 0) {
            result.push({
                type: 'success',
                icon: Users,
                title: 'Customer base is growing',
                description: `You gained ${Math.round(stats.customersChange)}% more customers compared to last period. Focus on retention to maximize lifetime value.`,
            });
        }
        // General tip
        result.push({
            type: 'info',
            icon: Lightbulb,
            title: 'Diversify your product mix',
            description: 'Products in multiple categories reduce risk. If one category slows down, others can compensate. Consider adding products in underrepresented categories.',
        });
        return result;
    }, [stats, revData, catData, topProductsData, products]);
    if (!products.length && !sales.length)
        return <Loading />;
    const typeStyles = {
        success: { bg: 'bg-green-50', border: 'border-green-200', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
        warning: { bg: 'bg-amber-50', border: 'border-amber-200', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
        info: { bg: 'bg-blue-50', border: 'border-blue-200', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
        opportunity: { bg: 'bg-primary-50', border: 'border-primary-200', iconBg: 'bg-primary-100', iconColor: 'text-primary-600' },
    };
    return (<div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600">
            <Sparkles className="h-5 w-5 text-white"/>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">AI Insights</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">Automated analysis and recommendations based on your business data.</p>
      </div>

      {/* Summary banner */}
      <div className="rounded-2xl border border-primary-200 bg-linear-to-r from-primary-50 to-white p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-600">
            <Sparkles className="h-6 w-6 text-white"/>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Weekly Business Summary</h2>
            <p className="mt-1 text-sm text-slate-600">
              Your business generated <strong>{formatCurrency(stats.totalRevenue)}</strong> in total revenue across{' '}
              <strong>{stats.totalOrders} orders</strong>. {stats.revenueChange >= 0 ? 'Growth is positive' : 'Revenue is trending down'} —
              see detailed recommendations below.
            </p>
          </div>
        </div>
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {insights.map((insight, i) => {
            const style = typeStyles[insight.type];
            return (<div key={i} className={`rounded-xl border ${style.border} ${style.bg} p-5 transition-all hover:shadow-md`}>
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${style.iconBg}`}>
                  <insight.icon className={`h-5 w-5 ${style.iconColor}`}/>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{insight.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{insight.description}</p>
                  {insight.action && (<Link to={insight.action.to} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
                      {insight.action.label}
                      <ArrowRight className="h-3.5 w-3.5"/>
                    </Link>)}
                </div>
              </div>
            </div>);
        })}
      </div>
    </div>);
}
