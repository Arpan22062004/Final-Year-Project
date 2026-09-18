/**
 * Optiora data service
 * ---------------------
 * This is the single data-access boundary used by the React pages.
 *
 * Development mode currently uses the localStorage database in `lib/db.js`.
 * When the Optiora backend is ready, this file is the main place to switch
 * the implementation to API calls without changing page components.
 */

export {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getSales,
  addSale,
  updateSale,
  deleteSale,
  getUsers,
  findUserByEmail,
  createUser,
} from '@/lib/db';
