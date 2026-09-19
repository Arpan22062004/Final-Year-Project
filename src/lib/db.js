import { uid } from '@/lib/utils';

const DB_KEY = 'biz_manager_db';

function loadDB() {
  const raw = localStorage.getItem(DB_KEY);

  if (raw) {
    try {
      const parsedDB = JSON.parse(raw);

      return {
        users: Array.isArray(parsedDB.users) ? parsedDB.users : [],
        products: Array.isArray(parsedDB.products) ? parsedDB.products : [],
        customers: Array.isArray(parsedDB.customers)
          ? parsedDB.customers
          : [],
        sales: Array.isArray(parsedDB.sales) ? parsedDB.sales : [],
      };
    } catch {
      // Invalid local data — recreate the database below.
    }
  }

  const database = seedDB();
  saveDB(database);

  return database;
}

function saveDB(database) {
  localStorage.setItem(DB_KEY, JSON.stringify(database));
}

function seedDB() {
  const now = Date.now();

  const daysAgo = (days) =>
    new Date(now - days * 24 * 60 * 60 * 1000).toISOString();

  const products = [
    {
      id: uid(),
      name: 'Aurora Wireless Headphones',
      sku: 'AUR-WH-01',
      category: 'Electronics',
      price: 199.99,
      cost: 85,
      stock: 42,
      createdAt: daysAgo(60),
    },
    {
      id: uid(),
      name: 'Nimbus Mechanical Keyboard',
      sku: 'NIM-KB-02',
      category: 'Electronics',
      price: 149.99,
      cost: 62,
      stock: 18,
      createdAt: daysAgo(55),
    },
    {
      id: uid(),
      name: 'Optiora Smartwatch Pro',
      sku: 'PUL-SW-03',
      category: 'Electronics',
      price: 299.99,
      cost: 120,
      stock: 7,
      createdAt: daysAgo(50),
    },
    {
      id: uid(),
      name: 'Verde Ceramic Mug',
      sku: 'VER-MG-04',
      category: 'Home & Living',
      price: 24.99,
      cost: 8.5,
      stock: 120,
      createdAt: daysAgo(45),
    },
    {
      id: uid(),
      name: 'Atlas Leather Backpack',
      sku: 'ATL-BP-05',
      category: 'Accessories',
      price: 179.99,
      cost: 55,
      stock: 25,
      createdAt: daysAgo(40),
    },
    {
      id: uid(),
      name: 'Solis Desk Lamp',
      sku: 'SOL-DL-06',
      category: 'Home & Living',
      price: 89.99,
      cost: 32,
      stock: 3,
      createdAt: daysAgo(35),
    },
    {
      id: uid(),
      name: 'Cascade Water Bottle',
      sku: 'CAS-WB-07',
      category: 'Accessories',
      price: 34.99,
      cost: 11,
      stock: 85,
      createdAt: daysAgo(30),
    },
    {
      id: uid(),
      name: 'Echo Bluetooth Speaker',
      sku: 'ECH-BS-08',
      category: 'Electronics',
      price: 129.99,
      cost: 48,
      stock: 0,
      createdAt: daysAgo(25),
    },
  ];

  const customers = [
    {
      id: uid(),
      name: 'Olivia Bennett',
      email: 'olivia.bennett@email.com',
      phone: '+1 555-0101',
      company: 'Bennett Studio',
      createdAt: daysAgo(58),
    },
    {
      id: uid(),
      name: 'Marcus Chen',
      email: 'marcus.chen@email.com',
      phone: '+1 555-0102',
      company: 'Chen & Co',
      createdAt: daysAgo(52),
    },
    {
      id: uid(),
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+1 555-0103',
      company: 'Sharma Designs',
      createdAt: daysAgo(48),
    },
    {
      id: uid(),
      name: 'James Okafor',
      email: 'james.okafor@email.com',
      phone: '+1 555-0104',
      company: 'Okafor Ventures',
      createdAt: daysAgo(42),
    },
    {
      id: uid(),
      name: 'Sofia Reyes',
      email: 'sofia.reyes@email.com',
      phone: '+1 555-0105',
      company: 'Reyes Retail',
      createdAt: daysAgo(38),
    },
    {
      id: uid(),
      name: 'Liam Murphy',
      email: 'liam.murphy@email.com',
      phone: '+1 555-0106',
      company: 'Murphy Group',
      createdAt: daysAgo(20),
    },
  ];

  const statuses = [
    'completed',
    'completed',
    'completed',
    'pending',
    'refunded',
  ];

  const sales = [];

  // Deterministic demo transactions make local development, screenshots,
  // QA and analytics comparisons repeatable. Production data will come from
  // the backend and will not use this seed.
  for (let index = 0; index < 48; index += 1) {
    const product = products[index % products.length];
    const customer = customers[(index * 2) % customers.length];
    const quantity = 1 + (index % 4);
    const status = statuses[index % statuses.length];
    const age = (index * 7) % 55;

    sales.push({
      id: uid(),
      productId: product.id,
      customerId: customer.id,
      quantity,
      total: Math.round(product.price * quantity * 100) / 100,
      status,
      saleDate: daysAgo(age),
      createdAt: daysAgo(age),
    });
  }

  return {
    users: [],
    products,
    customers,
    sales,
  };
}

/* -------------------------------------------------------------------------- */
/* Products                                                                   */
/* -------------------------------------------------------------------------- */

export function getProducts() {
  return loadDB().products;
}

export function addProduct(productData) {
  const database = loadDB();

  const product = {
    ...productData,
    id: uid(),
    createdAt: new Date().toISOString(),
  };

  database.products.push(product);
  saveDB(database);

  return product;
}

export function updateProduct(id, updates) {
  const database = loadDB();

  database.products = database.products.map((product) =>
    product.id === id
      ? {
          ...product,
          ...updates,
        }
      : product
  );

  saveDB(database);
}

export function deleteProduct(id) {
  const database = loadDB();

  database.products = database.products.filter(
    (product) => product.id !== id
  );

  // Keep historical sales records, but remove the broken product reference.
  database.sales = database.sales.map((sale) =>
    sale.productId === id
      ? {
          ...sale,
          productId: '',
        }
      : sale
  );

  saveDB(database);
}

/* -------------------------------------------------------------------------- */
/* Customers                                                                  */
/* -------------------------------------------------------------------------- */

export function getCustomers() {
  return loadDB().customers;
}

export function addCustomer(customerData) {
  const database = loadDB();

  const customer = {
    ...customerData,
    id: uid(),
    createdAt: new Date().toISOString(),
  };

  database.customers.push(customer);
  saveDB(database);

  return customer;
}

export function updateCustomer(id, updates) {
  const database = loadDB();

  database.customers = database.customers.map((customer) =>
    customer.id === id
      ? {
          ...customer,
          ...updates,
        }
      : customer
  );

  saveDB(database);
}

export function deleteCustomer(id) {
  const database = loadDB();

  database.customers = database.customers.filter(
    (customer) => customer.id !== id
  );

  // Keep historical sales records.
  database.sales = database.sales.map((sale) =>
    sale.customerId === id
      ? {
          ...sale,
          customerId: '',
        }
      : sale
  );

  saveDB(database);
}

/* -------------------------------------------------------------------------- */
/* Sales                                                                      */
/* -------------------------------------------------------------------------- */

export function getSales() {
  return loadDB().sales;
}

export function addSale(saleData) {
  const database = loadDB();

  const product = database.products.find(
    (item) => item.id === saleData.productId
  );

  if (!product) {
    throw new Error('Product not found.');
  }

  const quantity = Number(saleData.quantity);

  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error('Sale quantity must be greater than zero.');
  }

  if (quantity > product.stock) {
    throw new Error(
      `Not enough stock available. Only ${product.stock} units remain.`
    );
  }

  const sale = {
    ...saleData,
    quantity,
    id: uid(),
    createdAt: new Date().toISOString(),
  };

  database.sales.push(sale);

  database.products = database.products.map((item) =>
    item.id === product.id
      ? {
          ...item,
          stock: Math.max(0, item.stock - quantity),
        }
      : item
  );

  saveDB(database);

  return sale;
}

export function updateSale(id, updates) {
  const database = loadDB();

  const existingSale = database.sales.find(
    (sale) => sale.id === id
  );

  if (!existingSale) {
    throw new Error('Sale not found.');
  }

  database.sales = database.sales.map((sale) =>
    sale.id === id
      ? {
          ...sale,
          ...updates,
        }
      : sale
  );

  saveDB(database);
}

export function deleteSale(id) {
  const database = loadDB();

  const existingSale = database.sales.find(
    (sale) => sale.id === id
  );

  if (!existingSale) {
    return;
  }

  database.sales = database.sales.filter(
    (sale) => sale.id !== id
  );

  /*
   * Restore inventory when a sale is deleted.
   * If the product itself was deleted, there is nothing to restore.
   */
  database.products = database.products.map((product) =>
    product.id === existingSale.productId
      ? {
          ...product,
          stock: product.stock + Number(existingSale.quantity || 0),
        }
      : product
  );

  saveDB(database);
}

/* -------------------------------------------------------------------------- */
/* Authentication                                                             */
/* -------------------------------------------------------------------------- */

export function getUsers() {
  return loadDB().users;
}

export function findUserByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();

  return loadDB().users.find(
    (user) => user.email.toLowerCase() === normalizedEmail
  );
}

export function createUser(name, email, password) {
  const database = loadDB();

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  const user = {
    id: uid(),
    name: normalizedName,
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  database.users.push(user);
  saveDB(database);

  return user;
}

export function updateUser(id, updates) {
  const database = loadDB();

  database.users = database.users.map((user) =>
    user.id === id ? { ...user, ...updates } : user
  );

  saveDB(database);

  return database.users.find((user) => user.id === id) || null;
}