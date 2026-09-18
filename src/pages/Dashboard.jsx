import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Box,
  CalendarDays,
  ChevronDown,
  Download,
  FileText,
  PackagePlus,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
  WalletCards,
  ShoppingCart,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

import Loading from '@/components/Loading';
import { getProducts, getCustomers, getSales } from '@/services/dataService';
import { computeStats, salesByCategory, recentSales } from '@/lib/analytics';
import { formatCurrency, formatDate } from '@/lib/utils';
import { theme, ui } from '@/config/theme';

const PIE_COLORS = theme.chart;

function formatCompactCurrency(value) {
  const amount = Number(value) || 0;
  if (Math.abs(amount) >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (Math.abs(amount) >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return formatCurrency(amount);
}

function getDailyRevenue(sales, days = 30) {
  const completed = sales.filter((sale) => sale.status === 'completed');
  const today = new Date();
  const result = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - offset);

    const next = new Date(date);
    next.setDate(next.getDate() + 1);

    const revenue = completed
      .filter((sale) => {
        const saleDate = new Date(sale.saleDate);
        return saleDate >= date && saleDate < next;
      })
      .reduce((sum, sale) => sum + Number(sale.total || 0), 0);

    result.push({
      day: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      revenue: Math.round(revenue),
    });
  }

  return result;
}

function StatCard({ icon: Icon, label, value, change, tone = 'purple', helper }) {
  const tones = {
    purple: 'border-primary-100 bg-primary-50 text-primary-700',
    blue: 'border-blue-100 bg-blue-50 text-blue-700',
    cyan: 'border-cyan-100 bg-cyan-50 text-cyan-700',
    green: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    orange: 'border-amber-100 bg-amber-50 text-amber-700',
  };

  const positive = change >= 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${positive ? 'text-emerald-700' : 'text-rose-700'}`}>
          {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(Math.round(change))}%
        </span>
      </div>
      <p className="mt-5 text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-[27px] font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function Panel({ children, className = '' }) {
  return (
    <section className={`${ui.panel} ${className}`}>
      {children}
    </section>
  );
}

function PanelHeader({ title, subtitle, action }) {
  return (
    <div className={ui.panelHeader}>
      <div>
        <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function MiniSparkline({ data, dataKey = 'value', stroke = '#0f766e' }) {
  return (
    <ResponsiveContainer width="100%" height={54}>
      <AreaChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-${stroke.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.3} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={2} fill={`url(#spark-${stroke.replace('#', '')})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function Dashboard() {
  const products = useMemo(() => getProducts(), []);
  const customers = useMemo(() => getCustomers(), []);
  const sales = useMemo(() => getSales(), []);
  const stats = useMemo(() => computeStats(sales, customers, products), [sales, customers, products]);
  const categoryData = useMemo(() => salesByCategory(sales, products), [sales, products]);
  const recentSalesData = useMemo(() => recentSales(sales, products, customers, 4), [sales, products, customers]);
  const dailyRevenue = useMemo(() => getDailyRevenue(sales, 30), [sales]);

  const completedSales = useMemo(() => sales.filter((sale) => sale.status === 'completed'), [sales]);
  const lowStockProducts = useMemo(() => products.filter((product) => Number(product.stock) <= 5).sort((a, b) => Number(a.stock) - Number(b.stock)), [products]);

  const currentPeriodRevenue = useMemo(() => {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return completedSales.filter((sale) => new Date(sale.saleDate).getTime() >= cutoff).reduce((sum, sale) => sum + Number(sale.total || 0), 0);
  }, [completedSales]);

  const profit = useMemo(() => {
    const productMap = new Map(products.map((product) => [product.id, product]));
    return completedSales.reduce((sum, sale) => {
      const product = productMap.get(sale.productId);
      return sum + (Number(sale.total) || 0) - ((Number(product?.cost) || 0) * (Number(sale.quantity) || 0));
    }, 0);
  }, [completedSales, products]);

  const now = new Date();
  const monthStartLabel = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }).replace(/^\d+/, '1');
  const todayLabel = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const healthScore = Math.max(48, Math.min(96, Math.round(72 + stats.revenueChange * 0.35 + (lowStockProducts.length === 0 ? 10 : 0))));

  const insightItems = [
    stats.revenueChange >= 0
      ? { icon: TrendingUp, tone: 'green', title: `Revenue is up ${Math.abs(Math.round(stats.revenueChange))}%`, text: 'Sales momentum is stronger than the previous period.' }
      : { icon: ArrowDownRight, tone: 'red', title: `Revenue is down ${Math.abs(Math.round(stats.revenueChange))}%`, text: 'Review your recent sales channels and conversion rate.' },
    lowStockProducts.length
      ? { icon: Box, tone: 'orange', title: `${lowStockProducts.length} products need restocking`, text: `${lowStockProducts.slice(0, 2).map((p) => p.name).join(' and ')} are running low.` }
      : { icon: Sparkles, tone: 'purple', title: 'Inventory is healthy', text: 'No products are below the low-stock threshold.' },
    { icon: Users, tone: 'blue', title: `${stats.totalCustomers} customers in your base`, text: 'Keep recent buyers engaged with timely follow-ups.' },
  ];

  if (!products.length && !sales.length) return <Loading />;

  return (
    <div className="min-h-[calc(100vh-64px)] space-y-5 text-slate-700">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-slate-500">Track your business performance and AI insights in real-time.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
            <CalendarDays className="h-4 w-4 text-primary-700" />
            {monthStartLabel} - {todayLabel}
            <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
          </button>
          <Link to="/reports" className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-xs font-semibold text-slate-900 shadow-sm shadow-primary-600/20 transition hover:bg-primary-700">
            <Download className="h-4 w-4" />
            Download Report
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={WalletCards} label="Total Revenue" value={formatCurrency(stats.totalRevenue)} change={stats.revenueChange} tone="purple" helper="vs previous 30 days" />
        <StatCard icon={ShoppingCart} label="Total Sales" value={stats.totalOrders.toLocaleString()} change={stats.ordersChange} tone="blue" helper="completed orders" />
        <StatCard icon={Users} label="Total Customers" value={stats.totalCustomers.toLocaleString()} change={stats.customersChange} tone="cyan" helper="registered customers" />
        <StatCard icon={TrendingUp} label="Profit" value={formatCurrency(profit)} change={stats.revenueChange} tone="green" helper="estimated gross profit" />
        <StatCard icon={Box} label="Low Stock Items" value={stats.lowStockCount.toLocaleString()} change={stats.lowStockCount ? -25 : 0} tone="orange" helper="5 units or less" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Panel className="xl:col-span-6 overflow-hidden">
          <PanelHeader
            title="Sales Overview"
            subtitle="Daily revenue · last 30 days"
            action={<button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] text-slate-600 hover:bg-slate-50">This Month <ChevronDown className="ml-1 inline h-3 w-3" /></button>}
          />
          <div className="px-3 pt-3">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={dailyRevenue} margin={{ left: 4, right: 12, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashboardRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f766e" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#0f766e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={formatCompactCurrency} width={42} />
                <Tooltip
                  contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12, color: '#fff' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: 4 }}
                  formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0f766e" strokeWidth={2.5} fill="url(#dashboardRevenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 border-t border-slate-200">
            <div className="px-5 py-4"><p className="text-[11px] text-slate-500">This Month</p><p className="mt-1 text-lg font-semibold text-primary-700">{formatCurrency(currentPeriodRevenue)}</p></div>
            <div className="border-l border-slate-200 px-5 py-4"><p className="text-[11px] text-slate-500">Avg. Order</p><p className="mt-1 text-lg font-semibold text-slate-900">{formatCurrency(stats.avgOrderValue)}</p></div>
            <div className="border-l border-slate-200 px-5 py-4"><p className="text-[11px] text-slate-500">Growth</p><p className="mt-1 flex items-center gap-1 text-lg font-semibold text-emerald-700"><ArrowUpRight className="h-4 w-4" />{Math.round(stats.revenueChange)}%</p></div>
          </div>
        </Panel>

        <Panel className="xl:col-span-3">
          <PanelHeader title="Revenue by Category" subtitle="Distribution across products" action={<button type="button" className="text-slate-500 hover:text-slate-900"><ChevronDown className="h-4 w-4" /></button>} />
          <div className="relative mx-auto mt-2 h-47.5 w-full max-w-62.5">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={82} paddingAngle={3} stroke="none">
                  {categoryData.map((entry, index) => <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12 }} formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-[10px] text-slate-500">Total</span><span className="text-xl font-semibold text-slate-900">{formatCurrency(stats.totalRevenue)}</span></div>
          </div>
          <div className="space-y-2 px-5 pb-5">
            {categoryData.slice(0, 5).map((cat, index) => {
              const percent = stats.totalRevenue ? (cat.value / stats.totalRevenue) * 100 : 0;
              return <div key={cat.name} className="flex items-center justify-between text-xs"><span className="flex min-w-0 items-center gap-2 text-slate-600"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />{cat.name}</span><span className="text-slate-500">{percent.toFixed(1)}%</span></div>;
            })}
          </div>
        </Panel>

        <Panel className="xl:col-span-3 px-5 pb-5">
          <PanelHeader title="AI Business Health" subtitle="Performance signal" />
          <div className="relative mx-auto mt-3 h-32 w-64 max-w-full overflow-hidden">
  <svg
    viewBox="0 0 260 140"
    className="absolute inset-0 h-full w-full"
  >
    <defs>
      <linearGradient
        id="healthGradient"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="0%"
      >
        <stop offset="0%" stopColor="#63F5C1" />
        <stop offset="50%" stopColor="#32E89A" />
        <stop offset="100%" stopColor="#00D084" />
      </linearGradient>
    </defs>

    {/* Gray background */}
    <path
      d="M 25 125 A 105 105 0 0 1 235 125"
      fill="none"
      stroke="#e2e8f0"
      strokeWidth="14"
      strokeLinecap="round"
    />

    {/* Green progress */}
    <path
      d="M 25 125 A 105 105 0 0 1 235 125"
      fill="none"
      stroke="url(#healthGradient)"
      strokeWidth="14"
      strokeLinecap="round"
      pathLength="100"
      strokeDasharray={`${healthScore} 100`}
    />
  </svg>

  <div className="absolute inset-x-0 top-16 text-center">
    <span className="text-4xl font-semibold text-slate-900">
      {healthScore}
    </span>

    <span className="ml-1 text-xs text-slate-500">
      /100
    </span>
  </div>
</div>
          <div className="mt-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700"><Sparkles className="h-3.5 w-3.5" /> Healthy</div>
          <p className="mx-auto mt-3 max-w-52.5 text-center text-xs leading-5 text-slate-500">Your business is showing a {healthScore >= 75 ? 'healthy' : 'watch'} operating signal based on recent performance.</p>
          <Link to="/ai-insights" className="mt-4 block rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-100">View Full Analysis <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" /></Link>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Panel className="xl:col-span-3 overflow-hidden">
          <PanelHeader title="AI Insights" action={<Sparkles className="h-4 w-4 text-primary-700" />} />
          <div className="space-y-2.5 px-4 py-4">
            {insightItems.map(({ icon: Icon, tone, title, text }) => {
              const styles = { green: 'border-emerald-100 bg-emerald-500/5 text-emerald-700', red: 'border-rose-100 bg-rose-50 text-rose-700', orange: 'border-amber-100 bg-orange-500/5 text-amber-700', purple: 'border-primary-100 bg-primary-50 text-primary-700', blue: 'border-blue-100 bg-blue-500/5 text-blue-700' };
              return <div key={title} className={`rounded-xl border p-3 ${styles[tone]}`}><div className="flex gap-2.5"><Icon className="mt-0.5 h-4 w-4 shrink-0" /><div><p className="text-xs font-semibold text-slate-900">{title}</p><p className="mt-1 text-[11px] leading-4 text-slate-500">{text}</p></div></div></div>;
            })}
          </div>
          <Link to="/ai-insights" className="block border-t border-slate-200 px-5 py-3 text-xs font-semibold text-primary-700 hover:text-primary-800">View All Insights <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" /></Link>
        </Panel>

        <Panel className="xl:col-span-6">
          <PanelHeader title="Predictions" subtitle="AI-assisted business signals" action={<Link to="/ai-insights" className="text-xs font-medium text-primary-700">View All <ArrowUpRight className="ml-1 inline h-3 w-3" /></Link>} />
          <div className="grid gap-3 px-4 py-4 md:grid-cols-3">
            {[
              { title: 'Sales Forecast', value: formatCurrency(currentPeriodRevenue * 1.15), sub: 'Next 30 Days', change: 15.2, color: '#0f766e', icon: TrendingUp },
              { title: 'Product Demand', value: `${Math.max(1, Math.round((stats.totalOrders / Math.max(products.length, 1)) * 1.22))} Units`, sub: 'Next 30 Days', change: 22.7, color: '#2563eb', icon: BarChart3 },
              { title: 'Customer Churn', value: `${Math.max(1, Math.round(stats.totalCustomers * 0.055))} Customers`, sub: 'Next 30 Days', change: -8.6, color: '#0891b2', icon: Users },
            ].map(({ title, value, sub, change, color, icon: Icon }, index) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between"><div><p className="text-[11px] font-medium text-slate-500">{title}</p><p className="mt-1 text-[10px] text-slate-600">{sub}</p></div><Icon className="h-4 w-4" style={{ color }} /></div>
                <p className="mt-5 text-xl font-semibold text-slate-900">{value}</p>
                <p className={`mt-1 text-xs font-semibold ${change >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{change >= 0 ? '↑' : '↓'} {Math.abs(change)}%</p>
                <MiniSparkline stroke={color} data={dailyRevenue.slice(index * 10, index * 10 + 10).map((d, i) => ({ value: d.revenue + (i + 1) * (index + 1) * 120 }))} />
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500"><span>Confidence</span><span>{87 - index * 5}%</span></div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full" style={{ width: `${87 - index * 5}%`, backgroundColor: color }} /></div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-4 xl:col-span-3">
          <Panel>
            <PanelHeader title="Quick Actions" />
            <div className="grid grid-cols-2 gap-2 px-4 py-4">
              {[
                { to: '/products', label: 'Add Product', icon: PackagePlus },
                { to: '/customers', label: 'Add Customer', icon: UserPlus },
                { to: '/sales', label: 'Record Sale', icon: ShoppingCart },
                { to: '/reports', label: 'Generate Report', icon: FileText },
              ].map(({ to, label, icon: Icon }) => <Link key={label} to={to} className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-3 text-center text-[11px] font-medium text-slate-600 transition hover:border-primary-200 hover:bg-primary-50"><Icon className="mx-auto mb-1 h-5 w-5 text-primary-600" />{label}</Link>)}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Recent Notifications" action={<button type="button" className="text-xs text-primary-700">View All <ArrowUpRight className="ml-1 inline h-3 w-3" /></button>} />
            <div className="px-5 pb-4 pt-2">
              <div className="flex gap-3 border-b border-slate-200 py-3"><div className="rounded-lg bg-emerald-50 p-2 text-emerald-700"><Zap className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="text-xs font-medium text-slate-900">Sales target progress</p><p className="mt-1 text-[11px] text-slate-500">{Math.min(100, Math.round((currentPeriodRevenue / Math.max(stats.totalRevenue, 1)) * 100))}% of recent revenue target reached.</p></div></div>
              <div className="flex gap-3 py-3"><div className="rounded-lg bg-amber-50 p-2 text-amber-700"><AlertTriangle className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="text-xs font-medium text-slate-900">Low stock alert</p><p className="mt-1 text-[11px] text-slate-500">{lowStockProducts.length} items need attention.</p></div></div>
            </div>
          </Panel>
        </div>
      </div>

      <Panel>
        <PanelHeader title="Recent Sales" action={<Link to="/sales" className="text-xs font-medium text-primary-700">View All <ArrowUpRight className="ml-1 inline h-3 w-3" /></Link>} />
        <div className="overflow-x-auto px-5 pb-5 pt-4">
          <table className="w-full min-w-162.5 text-left text-xs">
            <thead><tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-600"><th className="pb-3 pr-4">Product</th><th className="pb-3 pr-4">Customer</th><th className="pb-3 pr-4">Date</th><th className="pb-3 pr-4">Status</th><th className="pb-3 text-right">Total</th></tr></thead>
            <tbody className="divide-y divide-white/5">{recentSalesData.map((sale) => <tr key={sale.id} className="hover:bg-slate-50"><td className="py-3 pr-4 font-medium text-slate-700">{sale.productName}</td><td className="py-3 pr-4 text-slate-500">{sale.customerName}</td><td className="py-3 pr-4 text-slate-500">{formatDate(sale.saleDate)}</td><td className="py-3 pr-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${sale.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : sale.status === 'pending' ? 'bg-amber-500/10 text-amber-300' : 'bg-rose-500/10 text-rose-700'}`}>{sale.status}</span></td><td className="py-3 text-right font-semibold text-slate-900">{formatCurrency(sale.total)}</td></tr>)}</tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
