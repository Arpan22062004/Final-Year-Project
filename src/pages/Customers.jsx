import { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, Mail, Phone, Building2, Users } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Loading from '@/components/Loading';
import { getCustomers, getSales, addCustomer, updateCustomer, deleteCustomer } from '@/services/dataService';
import { formatDate } from '@/lib/utils';
const emptyForm = { name: '', email: '', phone: '', company: '' };
export default function Customers() {
    const [customers, setCustomers] = useState(() => getCustomers());
    const sales = useMemo(() => getSales(), []);
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [deleteId, setDeleteId] = useState(null);
    const customerSpend = useMemo(() => {
        const map = new Map();
        for (const sale of sales) {
            if (sale.status !== 'completed')
                continue;
            const existing = map.get(sale.customerId) || { total: 0, orders: 0 };
            map.set(sale.customerId, { total: existing.total + sale.total, orders: existing.orders + 1 });
        }
        return map;
    }, [sales]);
    const filtered = useMemo(() => {
        return customers.filter((c) => !search ||
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email?.toLowerCase().includes(search.toLowerCase()) ||
            c.company?.toLowerCase().includes(search.toLowerCase()));
    }, [customers, search]);
    const openAdd = () => {
        setForm(emptyForm);
        setEditingId(null);
        setModalOpen(true);
    };
    const openEdit = (customer) => {
        setForm({ name: customer.name, email: customer.email, phone: customer.phone, company: customer.company });
        setEditingId(customer.id);
        setModalOpen(true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateCustomer(editingId, form);
        }
        else {
            addCustomer(form);
        }
        setCustomers(getCustomers());
        setModalOpen(false);
    };
    const handleDelete = () => {
        if (deleteId) {
            deleteCustomer(deleteId);
            setCustomers(getCustomers());
            setDeleteId(null);
        }
    };
    if (!customers.length)
        return <Loading message="Loading customers..."/>;
    return (<div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your customer relationships.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4"/>
          Add Customer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Total Customers</p>
            <Users className="h-4 w-4 text-primary-500"/>
          </div>
          <p className="mt-1 text-2xl font-bold text-slate-900">{customers.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Total Spend</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {formatPrice(Array.from(customerSpend.values()).reduce((s, v) => s + v.total, 0))}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Avg Customer Value</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {formatPrice(customers.length > 0 ? Array.from(customerSpend.values()).reduce((s, v) => s + v.total, 0) / customers.length : 0)}
          </p>
        </Card>
      </div>

      {/* Grid */}
      <Card>
        <div className="mb-4 relative max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
          <input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10"/>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((customer) => {
            const spend = customerSpend.get(customer.id) || { total: 0, orders: 0 };
            return (<div key={customer.id} className="group rounded-xl border border-slate-200 p-4 transition-all hover:border-primary-200 hover:shadow-md hover:shadow-slate-200/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{customer.name}</p>
                      <p className="text-xs text-slate-400">Since {formatDate(customer.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => openEdit(customer)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary-600">
                      <Pencil className="h-4 w-4"/>
                    </button>
                    <button onClick={() => setDeleteId(customer.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4"/>
                    </button>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5 text-sm">
                  {customer.email && (<p className="flex items-center gap-2 text-slate-600"><Mail className="h-3.5 w-3.5 text-slate-400"/> {customer.email}</p>)}
                  {customer.phone && (<p className="flex items-center gap-2 text-slate-600"><Phone className="h-3.5 w-3.5 text-slate-400"/> {customer.phone}</p>)}
                  {customer.company && (<p className="flex items-center gap-2 text-slate-600"><Building2 className="h-3.5 w-3.5 text-slate-400"/> {customer.company}</p>)}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <p className="text-xs text-slate-400">Total Spend</p>
                    <p className="text-sm font-semibold text-slate-900">{formatPrice(spend.total)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Orders</p>
                    <p className="text-sm font-semibold text-slate-900">{spend.orders}</p>
                  </div>
                </div>
              </div>);
        })}
        </div>
        {filtered.length === 0 && (<div className="py-12 text-center text-sm text-slate-400">No customers found. Try adjusting your search.</div>)}
      </Card>

      {/* Add/Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Customer' : 'Add Customer'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Jane Smith"/>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="jane@email.com"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone</label>
              <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="+1 555-0100"/>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Company</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="input-field" placeholder="Acme Inc."/>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingId ? 'Save Changes' : 'Add Customer'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Customer" size="sm">
        <p className="text-sm text-slate-600">Are you sure you want to delete this customer? Their sales records will be kept but unlinked.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>);
}
function formatPrice(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value);
}
