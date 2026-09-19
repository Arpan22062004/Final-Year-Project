// import { useState, useMemo } from 'react';
// import { Plus, Search, Pencil, Trash2, ShoppingCart, TrendingUp } from 'lucide-react';
// import Card from '@/components/Card';
// import Button from '@/components/Button';
// import Modal from '@/components/Modal';
// import Loading from '@/components/Loading';
// import { getSales, getProducts, getCustomers, addSale, updateSale, deleteSale } from '@/services/dataService';
// import { formatCurrency, formatDate } from '@/lib/utils';
// const emptyForm = { productId: '', customerId: '', quantity: 1, total: 0, status: 'completed', saleDate: new Date().toISOString().slice(0, 10) };
// export default function Sales() {
//     const [sales, setSales] = useState(() => getSales());
//     const products = useMemo(() => getProducts(), []);
//     const customers = useMemo(() => getCustomers(), []);
//     const [search, setSearch] = useState('');
//     const [statusFilter, setStatusFilter] = useState('all');
//     const [modalOpen, setModalOpen] = useState(false);
//     const [editingId, setEditingId] = useState(null);
//     const [form, setForm] = useState(emptyForm);
//     const [deleteId, setDeleteId] = useState(null);
//     const productMap = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
//     const customerMap = useMemo(() => new Map(customers.map((c) => [c.id, c])), [customers]);
//     const filtered = useMemo(() => {
//         return sales
//             .filter((s) => statusFilter === 'all' || s.status === statusFilter)
//             .filter((s) => {
//             if (!search)
//                 return true;
//             const pname = productMap.get(s.productId)?.name || '';
//             const cname = customerMap.get(s.customerId)?.name || '';
//             return pname.toLowerCase().includes(search.toLowerCase()) || cname.toLowerCase().includes(search.toLowerCase());
//         })
//             .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
//     }, [sales, search, statusFilter, productMap, customerMap]);
//     const totalRevenue = filtered.filter((s) => s.status === 'completed').reduce((sum, s) => sum + s.total, 0);
//     const totalOrders = filtered.length;
//     const pendingCount = filtered.filter((s) => s.status === 'pending').length;
//     const refundedCount = filtered.filter((s) => s.status === 'refunded').length;
//     const openAdd = () => {
//         setForm({ ...emptyForm, productId: products[0]?.id || '', customerId: customers[0]?.id || '', total: products[0]?.price || 0 });
//         setEditingId(null);
//         setModalOpen(true);
//     };
//     const openEdit = (sale) => {
//         setForm({
//             productId: sale.productId,
//             customerId: sale.customerId,
//             quantity: sale.quantity,
//             total: sale.total,
//             status: sale.status,
//             saleDate: sale.saleDate.slice(0, 10),
//         });
//         setEditingId(sale.id);
//         setModalOpen(true);
//     };
//     const handleProductChange = (productId) => {
//         const product = productMap.get(productId);
//         setForm((prev) => ({ ...prev, productId, total: (product?.price || 0) * prev.quantity }));
//     };
//     const handleQtyChange = (qty) => {
//         const product = productMap.get(form.productId);
//         setForm((prev) => ({ ...prev, quantity: qty, total: (product?.price || 0) * qty }));
//     };
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const payload = { ...form, saleDate: new Date(form.saleDate).toISOString() };
//         if (editingId) {
//             updateSale(editingId, payload);
//         }
//         else {
//             addSale(payload);
//         }
//         setSales(getSales());
//         setModalOpen(false);
//     };
//     const handleDelete = () => {
//         if (deleteId) {
//             deleteSale(deleteId);
//             setSales(getSales());
//             setDeleteId(null);
//         }
//     };
//     if (!sales.length)
//         return <Loading message="Loading sales..."/>;
//     return (<div className="space-y-6">
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-900">Sales</h1>
//           <p className="mt-1 text-sm text-slate-500">Track and manage all your transactions.</p>
//         </div>
//         <Button onClick={openAdd}>
//           <Plus className="h-4 w-4"/>
//           Record Sale
//         </Button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
//         <Card>
//           <div className="flex items-center justify-between">
//             <p className="text-sm text-slate-500">Revenue</p>
//             <TrendingUp className="h-4 w-4 text-primary-500"/>
//           </div>
//           <p className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
//         </Card>
//         <Card>
//           <div className="flex items-center justify-between">
//             <p className="text-sm text-slate-500">Total Orders</p>
//             <ShoppingCart className="h-4 w-4 text-blue-500"/>
//           </div>
//           <p className="mt-1 text-2xl font-bold text-slate-900">{totalOrders}</p>
//         </Card>
//         <Card>
//           <p className="text-sm text-slate-500">Pending</p>
//           <p className="mt-1 text-2xl font-bold text-amber-600">{pendingCount}</p>
//         </Card>
//         <Card>
//           <p className="text-sm text-slate-500">Refunded</p>
//           <p className="mt-1 text-2xl font-bold text-red-600">{refundedCount}</p>
//         </Card>
//       </div>

//       {/* Table */}
//       <Card>
//         <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div className="relative flex-1 sm:max-w-xs">
//             <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
//             <input type="text" placeholder="Search sales..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10"/>
//           </div>
//           <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
//             <option value="all">All Statuses</option>
//             <option value="completed">Completed</option>
//             <option value="pending">Pending</option>
//             <option value="refunded">Refunded</option>
//           </select>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
//                 <th className="pb-3 pr-4 font-medium">Product</th>
//                 <th className="pb-3 pr-4 font-medium">Customer</th>
//                 <th className="pb-3 pr-4 font-medium">Qty</th>
//                 <th className="pb-3 pr-4 font-medium">Date</th>
//                 <th className="pb-3 pr-4 font-medium">Status</th>
//                 <th className="pb-3 pr-4 text-right font-medium">Total</th>
//                 <th className="pb-3 text-right font-medium">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {filtered.map((sale) => (<tr key={sale.id} className="transition-colors hover:bg-slate-50">
//                   <td className="py-3 pr-4 font-medium text-slate-900">{productMap.get(sale.productId)?.name || 'N/A'}</td>
//                   <td className="py-3 pr-4 text-slate-600">{customerMap.get(sale.customerId)?.name || 'Walk-in'}</td>
//                   <td className="py-3 pr-4 text-slate-600">{sale.quantity}</td>
//                   <td className="py-3 pr-4 text-slate-500">{formatDate(sale.saleDate)}</td>
//                   <td className="py-3 pr-4">
//                     <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${sale.status === 'completed' ? 'bg-green-50 text-green-700' :
//                 sale.status === 'pending' ? 'bg-amber-50 text-amber-700' :
//                     'bg-red-50 text-red-700'}`}>
//                       {sale.status}
//                     </span>
//                   </td>
//                   <td className="py-3 pr-4 text-right font-semibold text-slate-900">{formatCurrency(sale.total)}</td>
//                   <td className="py-3">
//                     <div className="flex items-center justify-end gap-1">
//                       <button onClick={() => openEdit(sale)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary-600">
//                         <Pencil className="h-4 w-4"/>
//                       </button>
//                       <button onClick={() => setDeleteId(sale.id)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600">
//                         <Trash2 className="h-4 w-4"/>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>))}
//             </tbody>
//           </table>
//           {filtered.length === 0 && (<div className="py-12 text-center text-sm text-slate-400">No sales found. Try adjusting your filters.</div>)}
//         </div>
//       </Card>

//       {/* Add/Edit modal */}
//       <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Sale' : 'Record Sale'}>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Product</label>
//             <select required value={form.productId} onChange={(e) => handleProductChange(e.target.value)} className="input-field">
//               <option value="">Select a product</option>
//               {products.map((p) => (<option key={p.id} value={p.id}>{p.name} — {formatCurrency(p.price)}</option>))}
//             </select>
//           </div>
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">Customer</label>
//             <select value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} className="input-field">
//               <option value="">Walk-in customer</option>
//               {customers.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
//             </select>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="mb-1.5 block text-sm font-medium text-slate-700">Quantity</label>
//               <input type="number" min="1" required value={form.quantity} onChange={(e) => handleQtyChange(parseInt(e.target.value) || 1)} className="input-field"/>
//             </div>
//             <div>
//               <label className="mb-1.5 block text-sm font-medium text-slate-700">Total ($)</label>
//               <input type="number" step="0.01" min="0" required value={form.total} onChange={(e) => setForm({ ...form, total: parseFloat(e.target.value) || 0 })} className="input-field"/>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="mb-1.5 block text-sm font-medium text-slate-700">Sale Date</label>
//               <input type="date" required value={form.saleDate} onChange={(e) => setForm({ ...form, saleDate: e.target.value })} className="input-field"/>
//             </div>
//             <div>
//               <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
//               <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
//                 <option value="completed">Completed</option>
//                 <option value="pending">Pending</option>
//                 <option value="refunded">Refunded</option>
//               </select>
//             </div>
//           </div>
//           <div className="flex justify-end gap-3 pt-2">
//             <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
//             <Button type="submit">{editingId ? 'Save Changes' : 'Record Sale'}</Button>
//           </div>
//         </form>
//       </Modal>

//       {/* Delete confirm */}
//       <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Sale" size="sm">
//         <p className="text-sm text-slate-600">Are you sure you want to delete this sale record? This action cannot be undone.</p>
//         <div className="mt-6 flex justify-end gap-3">
//           <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
//           <Button variant="danger" onClick={handleDelete}>Delete</Button>
//         </div>
//       </Modal>
//     </div>);
// }


import { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, ShoppingCart, TrendingUp } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { getSales, getProducts, getCustomers, addSale, updateSale, deleteSale } from '@/services/dataService';
import { formatCurrency, formatDate } from '@/lib/utils';
const emptyForm = { productId: '', customerId: '', quantity: 1, total: 0, status: 'completed', saleDate: new Date().toISOString().slice(0, 10) };
export default function Sales() {
    const [sales, setSales] = useState(() => getSales());
    const products = useMemo(() => getProducts(), []);
    const customers = useMemo(() => getCustomers(), []);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [deleteId, setDeleteId] = useState(null);
    const [formError, setFormError] = useState('');
    const productMap = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
    const customerMap = useMemo(() => new Map(customers.map((c) => [c.id, c])), [customers]);
    const filtered = useMemo(() => {
        return sales
            .filter((s) => statusFilter === 'all' || s.status === statusFilter)
            .filter((s) => {
            if (!search)
                return true;
            const pname = productMap.get(s.productId)?.name || '';
            const cname = customerMap.get(s.customerId)?.name || '';
            return pname.toLowerCase().includes(search.toLowerCase()) || cname.toLowerCase().includes(search.toLowerCase());
        })
            .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
    }, [sales, search, statusFilter, productMap, customerMap]);
    const totalRevenue = filtered.filter((s) => s.status === 'completed').reduce((sum, s) => sum + s.total, 0);
    const totalOrders = filtered.length;
    const pendingCount = filtered.filter((s) => s.status === 'pending').length;
    const refundedCount = filtered.filter((s) => s.status === 'refunded').length;
    const openAdd = () => {
        if (!products.length) {
            setFormError('Add a product before recording a sale.');
            setModalOpen(true);
            return;
        }
        setForm({ ...emptyForm, productId: products[0]?.id || '', customerId: customers[0]?.id || '', total: products[0]?.price || 0 });
        setEditingId(null);
        setModalOpen(true);
    };
    const openEdit = (sale) => {
        setForm({
            productId: sale.productId,
            customerId: sale.customerId,
            quantity: sale.quantity,
            total: sale.total,
            status: sale.status,
            saleDate: sale.saleDate.slice(0, 10),
        });
        setEditingId(sale.id);
        setModalOpen(true);
    };
    const handleProductChange = (productId) => {
        const product = productMap.get(productId);
        setForm((prev) => ({ ...prev, productId, total: (product?.price || 0) * prev.quantity }));
    };
    const handleQtyChange = (qty) => {
        const product = productMap.get(form.productId);
        setForm((prev) => ({ ...prev, quantity: qty, total: (product?.price || 0) * qty }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form, saleDate: new Date(form.saleDate).toISOString() };
        try {
            if (editingId) {
                updateSale(editingId, payload);
            }
            else {
                addSale(payload);
            }
            setSales(getSales());
            setFormError('');
            setModalOpen(false);
        } catch (error) {
            setFormError(error.message);
        }
    };
    const handleDelete = () => {
        if (deleteId) {
            deleteSale(deleteId);
            setSales(getSales());
            setDeleteId(null);
        }
    };
    return (<div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sales</h1>
          <p className="mt-1 text-sm text-slate-500">Track and manage all your transactions.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4"/>
          Record Sale
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Revenue</p>
            <TrendingUp className="h-4 w-4 text-primary-500"/>
          </div>
          <p className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Orders</p>
            <ShoppingCart className="h-4 w-4 text-blue-500"/>
          </div>
          <p className="mt-1 text-2xl font-bold text-slate-900">{totalOrders}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Pending</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{pendingCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Refunded</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{refundedCount}</p>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
            <input type="text" placeholder="Search sales..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10"/>
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                <th className="pb-3 pr-4 font-medium">Product</th>
                <th className="pb-3 pr-4 font-medium">Customer</th>
                <th className="pb-3 pr-4 font-medium">Qty</th>
                <th className="pb-3 pr-4 font-medium">Date</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 text-right font-medium">Total</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((sale) => (<tr key={sale.id} className="transition-colors hover:bg-slate-50">
                  <td className="py-3 pr-4 font-medium text-slate-900">{productMap.get(sale.productId)?.name || 'N/A'}</td>
                  <td className="py-3 pr-4 text-slate-600">{customerMap.get(sale.customerId)?.name || 'Walk-in'}</td>
                  <td className="py-3 pr-4 text-slate-600">{sale.quantity}</td>
                  <td className="py-3 pr-4 text-slate-500">{formatDate(sale.saleDate)}</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${sale.status === 'completed' ? 'bg-green-50 text-green-700' :
                sale.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                    'bg-red-50 text-red-700'}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right font-semibold text-slate-900">{formatCurrency(sale.total)}</td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(sale)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary-600">
                        <Pencil className="h-4 w-4"/>
                      </button>
                      <button onClick={() => setDeleteId(sale.id)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4"/>
                      </button>
                    </div>
                  </td>
                </tr>))}
            </tbody>
          </table>
          {filtered.length === 0 && (<div className="py-12 text-center text-sm text-slate-400">{sales.length ? 'No sales found. Try adjusting your filters.' : 'No sales recorded yet. Record your first transaction to start tracking performance.'}</div>)}
        </div>
      </Card>

      {/* Add/Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Sale' : 'Record Sale'}>
        {!products.length ? <div className="space-y-4"><p className="text-sm text-slate-600">Add at least one product before recording a sale.</p><Button onClick={() => { setModalOpen(false); window.location.assign('/products'); }}>Go to products</Button></div> :
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Product</label>
            <select required value={form.productId} onChange={(e) => handleProductChange(e.target.value)} className="input-field">
              <option value="">Select a product</option>
              {products.map((p) => (<option key={p.id} value={p.id}>{p.name} — {formatCurrency(p.price)}</option>))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Customer</label>
            <select value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} className="input-field">
              <option value="">Walk-in customer</option>
              {customers.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Quantity</label>
              <input type="number" min="1" required value={form.quantity} onChange={(e) => handleQtyChange(parseInt(e.target.value) || 1)} className="input-field"/>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Total ($)</label>
              <input type="number" step="0.01" min="0" required value={form.total} onChange={(e) => setForm({ ...form, total: parseFloat(e.target.value) || 0 })} className="input-field"/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Sale Date</label>
              <input type="date" required value={form.saleDate} onChange={(e) => setForm({ ...form, saleDate: e.target.value })} className="input-field"/>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingId ? 'Save Changes' : 'Record Sale'}</Button>
          </div>
          {formError && <p className="text-sm text-red-600" role="alert">{formError}</p>}
        </form>
        }
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Sale" size="sm">
        <p className="text-sm text-slate-600">Are you sure you want to delete this sale record? This action cannot be undone.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>);
}