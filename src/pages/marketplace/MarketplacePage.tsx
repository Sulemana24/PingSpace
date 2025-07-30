import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

import {
  FaTimes,
  FaShoppingCart,
  FaStore,
  FaBoxOpen,
  FaClipboardList,
  FaTags,
} from "react-icons/fa";
import backpack from "../../components/assets/backpack.jpeg";
import headset from "../../components/assets/headset.jpeg";
import jacket from "../../components/assets/jcket.jpeg";
import mouse from "../../components/assets/mouse.jpeg";
import shoes from "../../components/assets/sneakers.jpeg";
import speaker from "../../components/assets/speaker.jpeg";
import sunglasses from "../../components/assets/sunglasses.jpeg";
import tablet from "../../components/assets/tablet.jpeg";
import watch from "../../components/assets/watch.jpeg";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
};

const sampleProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 120,
    category: "Electronics",
    image: headset,
    description: "High-quality wireless headphones with noise cancellation.",
  },
  {
    id: 2,
    name: "Running Shoes",
    price: 90,
    category: "Fashion",
    image: shoes,
    description: "Comfortable running shoes for daily use.",
  },
  {
    id: 3,
    name: "Gaming Mouse",
    price: 45,
    category: "Electronics",
    image: mouse,
    description: "Ergonomic gaming mouse with RGB lighting.",
  },
  {
    id: 4,
    name: "Smart Watch",
    price: 199,
    category: "Electronics",
    image: watch,
    description: "Smartwatch with health tracking features.",
  },
  {
    id: 5,
    name: "Leather Jacket",
    price: 150,
    category: "Fashion",
    image: jacket,
    description: "Premium leather jacket for a bold look.",
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 85,
    category: "Electronics",
    image: speaker,
    description: "Portable speaker with excellent sound quality.",
  },
  {
    id: 7,
    name: "Sunglasses",
    price: 35,
    category: "Fashion",
    image: sunglasses,
    description: "Stylish UV-protective sunglasses.",
  },
  {
    id: 8,
    name: "Backpack",
    price: 70,
    category: "Fashion",
    image: backpack,
    description: "Durable backpack for everyday use.",
  },
  {
    id: 9,
    name: "Tablet",
    price: 299,
    category: "Electronics",
    image: tablet,
    description: "Lightweight tablet for work and entertainment.",
  },
];

export default function MarketplacePage() {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState("browse");
  const [showCartModal, setShowCartModal] = useState(false);
  const navigate = useNavigate();

  const filteredProducts = sampleProducts.filter((product) => {
    const matchCategory =
      categoryFilter === "All" || product.category === categoryFilter;
    const matchPrice =
      priceFilter === "All" ||
      (priceFilter === "<50" && product.price < 50) ||
      (priceFilter === "50-100" &&
        product.price >= 50 &&
        product.price <= 100) ||
      (priceFilter === ">100" && product.price > 100);
    return matchCategory && matchPrice;
  });

  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
    alert(`Ghc${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen  bg-white dark:bg-gray-900 p-4 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Marketplace
        </h1>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow flex justify-between items-center flex-wrap gap-2 mt-4">
        <div
          onClick={() => setActiveTab("browse")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition ${
            activeTab === "browse"
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          <FaStore
            className={activeTab === "browse" ? "text-white" : "text-red-500"}
          />
          <span>Browse</span>
        </div>

        <div
          onClick={() => setActiveTab("myProducts")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition ${
            activeTab === "myProducts"
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          <FaClipboardList
            className={
              activeTab === "myProducts" ? "text-white" : "text-red-500"
            }
          />
          <span>My Products</span>
        </div>

        <div
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition ${
            activeTab === "orders"
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          <FaBoxOpen
            className={activeTab === "orders" ? "text-white" : "text-red-500"}
          />
          <span>Orders</span>
        </div>

        <div
          onClick={() => setActiveTab("sell")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition ${
            activeTab === "sell"
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          <FaTags
            className={activeTab === "sell" ? "text-white" : "text-red-500"}
          />
          <span>Sell</span>
        </div>

        <div
          onClick={() => setShowCartModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer bg-gray-700 hover:bg-gray-800 text-white transition"
        >
          <FaShoppingCart />
          <span>Cart ({cart.length})</span>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border rounded-md text-black"
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
        </select>

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="px-3 py-2 border rounded-md text-black"
        >
          <option value="All">All Prices</option>
          <option value="<50">Below Ghc50</option>
          <option value="50-100">Ghc50 - Ghc100</option>
          <option value=">100">Above Ghc100</option>
        </select>
      </div>

      <div className="overflow-y-auto max-h-[30vh] md:max-h-[60vh]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              No products found.
            </p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md bg-white dark:bg-gray-800"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 space-y-2  mb-8">
                  <h2
                    className="text-lg font-semibold cursor-pointer"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.name}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Ghc{product.price}
                  </p>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-red-600 hover:bg-red-700 transition text-white px-3 py-1 rounded-md"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Product Modal */}
      <Dialog open={!!selectedProduct} onClose={() => setSelectedProduct(null)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300"
            >
              <FaTimes />
            </button>
            <img
              src={selectedProduct?.image}
              alt={selectedProduct?.name}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="text-xl font-bold mt-4">{selectedProduct?.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {selectedProduct?.description}
            </p>
            <p className="text-gray-800 dark:text-white mt-2 font-semibold">
              Ghc{selectedProduct?.price}
            </p>
          </div>
        </div>
      </Dialog>
      {showCartModal && (
        <Dialog open={true} onClose={() => setShowCartModal(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6 relative">
              <button
                onClick={() => setShowCartModal(false)}
                className="absolute top-2 right-2 text-gray-600 dark:text-gray-300"
              >
                <FaTimes />
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Cart Items
              </h2>

              {cart.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">
                  Your cart is empty
                </p>
              ) : (
                <ul className="space-y-4">
                  {cart.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center border-b pb-2 text-gray-800 dark:text-gray-300"
                    >
                      <span>{item.name}</span>
                      <span className="font-semibold">Ghc{item.price}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => {
                  setShowCartModal(false);
                  navigate("/payment", {
                    state: {
                      cart,
                      total: cart.reduce((sum, item) => sum + item.price, 0),
                    },
                  });
                }}
                className="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
