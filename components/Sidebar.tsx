import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-64 border-r bg-background  flex flex-col justify-between mt-10">
      <div className="px-4 py-6">
        <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
          Admin Panel
        </span>

        <ul className="mt-6 space-y-1">
          <li>
          <Link
              href="/admin"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              Manage Products
            </Link>
          </li>

          <li>
            <Link
              href="/admin/orders"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              Manage Orders
            </Link>
          </li>

          <li>
            <Link
              href="/admin/users"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              Manage Users
            </Link>
          </li>

          <li>
            <Link
              href="/admin/categories"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              Manage Categories
            </Link>
          </li>

          
        </ul>
      </div>

      
    </div>
  );
};

export default Sidebar;
