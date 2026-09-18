import { useMemo, useState } from 'react';
import { FileBarChart, Download, TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, } from 'recharts';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import { getProducts, getCustomers, getSales } from '@/services/dataService';
import { computeStats, revenueByMonth, salesByCategory, topProducts } from '@/lib/analytics';
import { formatCurrency } from '@/lib/utils';
export default function Reports() {
    const [reportType, setReportType] = useState('revenue');
    const products = useMemo(() => getProducts(), []);
    const customers = useMemo(() => getCustomers(), []);
    const sales = useMemo(() => getSales(), []);
    const stats = useMemo(() => computeStats(sales, customers, products), [sales, customers, products]);
    const revData = useMemo(() => revenueByMonth(sales), [sales]);
    const catData = useMemo(() => salesByCategory(sales, products), [sales, products]);
    const topProductsData = useMemo(() => topProducts(sales, products, 10), [sales, products]);
    const customerData = useMemo(() => {
        const map = new Map();
        for (const sale of sales) {
            if (sale.status !== 'completed')
                continue;
            const customer = customers.find((c) => c.id === sale.customerId);
            const name = customer?.name || 'Walk-in';
            const existing = map.get(sale.customerId) || { name, total: 0, orders: 0 };
            map.set(sale.customerId, { name, total: existing.total + sale.total, orders: existing.orders + 1 });
        }
        return Array.from(map.values()).sort((a, b) => b.total - a.total).slice(0, 10);
    }, [sales, customers]);
    if (!products.length && !sales.length)
        return <Loading />;
    const handleExport = () => {
        let csv = '';
        if (reportType === 'revenue') {
            csv = 'Month,Revenue\n' + revData.map((d) => `${d.month},${d.revenue}`).join('\n');
        }
        else if (reportType === 'products') {
            csv = 'Product,Revenue,Quantity\n' + topProductsData.map((d) => `"${d.name}",${d.revenue},${d.quantity}`).join('\n');
        }
        else {
            csv = 'Customer,Total Spend,Orders\n' + customerData.map((d) => `"${d.name}",${d.total},${d.orders}`).join('\n');
        }
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}-report.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };
    const reportTabs = [
        { key: 'revenue', label: 'Revenue', icon: DollarSign },
        { key: 'products', label: 'Products', icon: Package },
        { key: 'customers', label: 'Customers', icon: Users },
    ];
    return (<div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600">
              <FileBarChart className="h-5 w-5 text-white"/>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">Analyze your business performance with detailed reports.</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4"/>
          Export CSV
        </Button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Revenue</p>
            <DollarSign className="h-4 w-4 text-primary-500"/>
          </div>
          <p className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(stats.totalRevenue)}</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Orders</p>
            <TrendingUp className="h-4 w-4 text-blue-500"/>
          </div>
          <p className="mt-1 text-2xl font-bold text-slate-900">{stats.totalOrders}</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Products</p>
            <Package className="h-4 w-4 text-amber-500"/>
          </div>
          <p className="mt-1 text-2xl font-bold text-slate-900">{stats.totalProducts}</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Customers</p>
            <Users className="h-4 w-4 text-green-500"/>
          </div>
          <p className="mt-1 text-2xl font-bold text-slate-900">{stats.totalCustomers}</p>
        </Card>
      </div>

      {/* Report tabs */}
      <div className="flex gap-2 rounded-lg border border-slate-200 bg-white p-1">
        {reportTabs.map((tab) => (<button key={tab.key} onClick={() => setReportType(tab.key)} className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${reportType === tab.key ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
            <tab.icon className="h-4 w-4"/>
            {tab.label}
          </button>))}
      </div>

      {/* Report content */}
      {reportType === 'revenue' && (<div className="space-y-4">
          <Card>
            <h3 className="mb-4 text-base font-semibold text-slate-900">Monthly Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={revData} margin={{ left: -20, right: 10, top: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`}/>
                <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '13px' }} formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}/>
                <Line type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={2.5} dot={{ fill: '#0d9488', r: 4 }} activeDot={{ r: 6 }}/>
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <h3 className="mb-4 text-base font-semibold text-slate-900">Revenue by Category</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={catData} margin={{ left: -20, right: 10, top: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`}/>
                <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '13px' }} formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}/>
                <Bar dataKey="value" fill="#0d9488" radius={[6, 6, 0, 0]} barSize={40}/>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>)}

      {reportType === 'products' && (<Card>
          <h3 className="mb-4 text-base font-semibold text-slate-900">Top Products by Revenue</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="pb-3 pr-4 font-medium">#</th>
                  <th className="pb-3 pr-4 font-medium">Product</th>
                  <th className="pb-3 pr-4 text-right font-medium">Units Sold</th>
                  <th className="pb-3 text-right font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topProductsData.map((p, i) => (<tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 pr-4 text-slate-400">{i + 1}</td>
                    <td className="py-3 pr-4 font-medium text-slate-900">{p.name}</td>
                    <td className="py-3 pr-4 text-right text-slate-600">{p.quantity}</td>
                    <td className="py-3 text-right font-semibold text-slate-900">{formatCurrency(p.revenue)}</td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </Card>)}

      {reportType === 'customers' && (<Card>
          <h3 className="mb-4 text-base font-semibold text-slate-900">Top Customers by Spend</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="pb-3 pr-4 font-medium">#</th>
                  <th className="pb-3 pr-4 font-medium">Customer</th>
                  <th className="pb-3 pr-4 text-right font-medium">Orders</th>
                  <th className="pb-3 text-right font-medium">Total Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customerData.map((c, i) => (<tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 pr-4 text-slate-400">{i + 1}</td>
                    <td className="py-3 pr-4 font-medium text-slate-900">{c.name}</td>
                    <td className="py-3 pr-4 text-right text-slate-600">{c.orders}</td>
                    <td className="py-3 text-right font-semibold text-slate-900">{formatCurrency(c.total)}</td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </Card>)}
    </div>);
}
