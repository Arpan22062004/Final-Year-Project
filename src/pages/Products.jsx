import { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, Package, AlertTriangle, X } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/services/dataService';
import { formatCurrency, formatDate } from '@/lib/utils';
const emptyForm = { name: '', sku: '', category: '', price: 0, cost: 0, stock: 0 };
export default function Products() {
    const [products, setProducts] = useState(() => getProducts());
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [deleteId, setDeleteId] = useState(null);
    const categories = useMemo(() => {
        const set = new Set(products.map((p) => p.category).filter(Boolean));
        return ['all', ...Array.from(set)];
    }, [products]);
    const filtered = useMemo(() => {
        return products
            .filter((p) => categoryFilter === 'all' || p.category === categoryFilter)
            .filter((p) => !search ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.sku?.toLowerCase().includes(search.toLowerCase()));
    }, [products, search, categoryFilter]);
    const openAdd = () => {
        setForm(emptyForm);
        setEditingId(null);
        setModalOpen(true);
    };
    const openEdit = (product) => {
        setForm({ name: product.name, sku: product.sku, category: product.category, price: product.price, cost: product.cost, stock: product.stock });
        setEditingId(product.id);
        setModalOpen(true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateProduct(editingId, form);
        }
        else {
            addProduct(form);
        }
        setProducts(getProducts());
        setModalOpen(false);
    };
    const handleDelete = () => {
        if (deleteId) {
            deleteProduct(deleteId);
            setProducts(getProducts());
            setDeleteId(null);
        }
    };
    return (<div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your inventory and catalog.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4"/>
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-500">Total Products</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{products.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Total Stock Value</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(products.reduce((s, p) => s + p.price * p.stock, 0))}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Low Stock</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{products.filter((p) => p.stock <= 5).length}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Out of Stock</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{products.filter((p) => p.stock === 0).length}</p>
        </Card>
      </div>

      {/* Filters + table */}
      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10"/>
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
            {categories.map((c) => (<option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                <th className="pb-3 pr-4 font-medium">Product</th>
                <th className="pb-3 pr-4 font-medium">Category</th>
                <th className="pb-3 pr-4 font-medium">Price</th>
                <th className="pb-3 pr-4 font-medium">Stock</th>
                <th className="pb-3 pr-4 font-medium">Created</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((product) => (<tr key={product.id} className="transition-colors hover:bg-slate-50">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50">
                        <Package className="h-4 w-4 text-primary-600"/>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-400">{product.sku || 'No SKU'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{product.category || '—'}</td>
                  <td className="py-3 pr-4 font-medium text-slate-900">{formatCurrency(product.price)}</td>
                  <td className="py-3 pr-4">
                    {product.stock === 0 ? (<span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                        <X className="h-3 w-3"/> Out of stock
                      </span>) : product.stock <= 5 ? (<span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                        <AlertTriangle className="h-3 w-3"/> {product.stock} left
                      </span>) : (<span className="text-slate-600">{product.stock} in stock</span>)}
                  </td>
                  <td className="py-3 pr-4 text-slate-500">{formatDate(product.createdAt)}</td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(product)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary-600">
                        <Pencil className="h-4 w-4"/>
                      </button>
                      <button onClick={() => setDeleteId(product.id)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4"/>
                      </button>
                    </div>
                  </td>
                </tr>))}
            </tbody>
          </table>
          {filtered.length === 0 && (<div className="py-12 text-center text-sm text-slate-400">{products.length ? 'No products found. Try adjusting your filters.' : 'Your catalog is empty. Add your first product to get started.'}</div>)}
        </div>
      </Card>

      {/* Add/Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Product Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. Aurora Headphones"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">SKU</label>
              <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="input-field" placeholder="AUR-001"/>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
              <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field" placeholder="Electronics"/>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Price ($)</label>
              <input type="number" step="0.01" min="0" required value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="input-field"/>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Cost ($)</label>
              <input type="number" step="0.01" min="0" value={form.cost} onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })} className="input-field"/>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Stock</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} className="input-field"/>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingId ? 'Save Changes' : 'Add Product'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Product" size="sm">
        <p className="text-sm text-slate-600">Are you sure you want to delete this product? This action cannot be undone.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>);
}