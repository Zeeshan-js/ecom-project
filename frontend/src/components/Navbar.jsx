import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext.jsx";
import UploadProduct from "./UploadProduct.jsx";
import { ShoppingBagIcon, UserCircleIcon, PlusIcon } from "@heroicons/react/20/solid";
import { LocalStorage } from "../utils/index.js";

const Navbar = () => {
  const [uploadProduct, setUploadProduct] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    LocalStorage.clear();
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      {uploadProduct && (
        <UploadProduct
          open={uploadProduct}
          onClose={() => setUploadProduct(false)}
        />
      )}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left section */}
            <div className="flex items-center">
              <Link
                to="/landingPage"
                className="text-amber-700 hover:text-amber-800 font-semibold text-lg"
              >
                Store
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/landingPage"
                  className="text-gray-900 hover:text-amber-700 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/catalog"
                  className="text-gray-900 hover:text-amber-700 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Catalog
                </Link>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              {user && (
                <button
                  onClick={() => setUploadProduct(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Upload
                </button>
              )}
              
              <Link
                to="/cart"
                className="text-gray-700 hover:text-amber-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ShoppingBagIcon className="h-6 w-6" />
              </Link>

              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-amber-700 focus:outline-none">
                    <UserCircleIcon className="h-8 w-8" />
                    <span>{user.username}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-1 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-amber-700 font-medium"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/landingPage"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-gray-50 rounded-md"
            >
              Home
            </Link>
            <Link
              to="/catalog"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-amber-700 hover:bg-gray-50 rounded-md"
            >
              Catalog
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;