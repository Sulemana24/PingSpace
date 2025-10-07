import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

type PaymentMethod = {
  type: "Credit Card" | "Mobile Money";
  provider: string;
  last4?: string;
  number?: string;
};

interface LocationState {
  cart?: { name: string; price: number }[];
  total?: number;
}

export default function PaymentPage() {
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [methodType, setMethodType] = useState<"Credit Card" | "Mobile Money">(
    "Credit Card"
  );
  const [provider, setProvider] = useState("Visa");
  const [accountInfo, setAccountInfo] = useState("");

  const location = useLocation() as { state?: LocationState };
  const navigate = useNavigate();
  const cart = location.state?.cart ?? [];
  const total = location.state?.total ?? 0;

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { type: "Credit Card", provider: "Visa", last4: "4242" },
    { type: "Mobile Money", provider: "MTN", number: "0241234567" },
  ]);

  const [paymentHistory] = useState([
    { id: 1, date: "2025-07-10", amount: 49.99, method: "Visa" },
    { id: 2, date: "2025-06-10", amount: 49.99, method: "MTN MoMo" },
  ]);

  const totalPaid = paymentHistory
    .reduce((sum, p) => sum + p.amount, 0)
    .toFixed(2);

  const openAddModal = () => {
    setEditIndex(null);
    setAccountInfo("");
    setMethodType("Credit Card");
    setProvider("Visa");
    setShowModal(true);
  };

  const openEditModal = (index: number) => {
    const method = paymentMethods[index];
    setEditIndex(index);
    setMethodType(method.type);
    setProvider(method.provider);
    setAccountInfo(
      method.type === "Credit Card" ? method.last4 || "" : method.number || ""
    );
    setShowModal(true);
  };

  const handleAddOrEditMethod = (e: React.FormEvent) => {
    e.preventDefault();
    const newMethod: PaymentMethod =
      methodType === "Credit Card"
        ? {
            type: "Credit Card",
            provider,
            last4: accountInfo.slice(-4),
          }
        : {
            type: "Mobile Money",
            provider,
            number: accountInfo,
          };

    if (editIndex !== null) {
      const updated = [...paymentMethods];
      updated[editIndex] = newMethod;
      setPaymentMethods(updated);
    } else {
      setPaymentMethods([...paymentMethods, newMethod]);
    }

    setShowModal(false);
    setAccountInfo("");
    setProvider("Visa");
    setMethodType("Credit Card");
    setEditIndex(null);
  };

  const handleDeleteMethod = (index: number) => {
    const updated = [...paymentMethods];
    updated.splice(index, 1);
    setPaymentMethods(updated);
  };

  return (
    <div className="h-screen overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Payment</h1>

        {/* Payment Totals */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Total Paid</h2>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            Ghc{totalPaid}
          </p>
        </div>

        {/* Checkout Section */}
        {cart.length > 0 && (
          <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-2">Checkout Summary</h2>
            <p className="mb-1">You are about to pay for:</p>
            <ul className="list-disc list-inside text-sm mb-2">
              {cart.map((item, i) => (
                <li key={i}>
                  {item.name} - Ghc{item.price.toFixed(2)}
                </li>
              ))}
            </ul>
            <p className="font-bold mb-4">Total: Ghc{total.toFixed(2)}</p>

            {paymentMethods.length === 0 ? (
              <p className="text-red-600 dark:text-red-400">
                Please add a payment method before proceeding.
              </p>
            ) : (
              <>
                <label className="block mb-1 font-medium">
                  Select Payment Method
                </label>
                <select
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 text-black mb-4"
                  onChange={(e) => setProvider(e.target.value)}
                  value={provider}
                >
                  {paymentMethods.map((m: PaymentMethod, idx: number) => (
                    <option key={idx} value={m.provider}>
                      {m.type} - {m.provider}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    alert(
                      `Payment of Ghc${total.toFixed(
                        2
                      )} successful using ${provider}!`
                    );
                    navigate("/marketplace");
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Confirm Payment
                </button>
              </>
            )}
          </div>
        )}

        {/* Payment Methods */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Payment Methods</h2>
            <button
              onClick={openAddModal}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Payment Method
            </button>
          </div>
          <ul className="space-y-2">
            {paymentMethods.map((method: PaymentMethod, index: number) => (
              <li
                key={index}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <span className="block">
                    {method.type} - {method.provider}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {method.last4
                      ? `**** **** **** ${method.last4}`
                      : method.number}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    aria-label="Edit payment method"
                    onClick={() => openEditModal(index)}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteMethod(index)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete payment method"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment History */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md h-auto overflow-y-auto">
          <h2 className="text-xl font-semibold mb-2">Payment History</h2>
          <div className="overflow-x-auto max-h-64 overflow-y-auto border rounded-md dark:border-gray-700">
            <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-200 dark:bg-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Method</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 dark:divide-gray-600">
                <tr>
                  <td className="px-4 py-2">2025-07-01</td>
                  <td className="px-4 py-2">Visa</td>
                  <td className="px-4 py-2 text-blue-500">Ongoing</td>
                  <td className="px-4 py-2">Ghc49.99</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">2025-06-15</td>
                  <td className="px-4 py-2">MTN MoMo</td>
                  <td className="px-4 py-2 text-green-600">Successful</td>
                  <td className="px-4 py-2">Ghc19.99</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">2025-06-01</td>
                  <td className="px-4 py-2">Mastercard</td>
                  <td className="px-4 py-2 text-red-500">Failed</td>
                  <td className="px-4 py-2">Ghc29.99</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">2025-05-12</td>
                  <td className="px-4 py-2">Telecel</td>
                  <td className="px-4 py-2 text-green-600">Successful</td>
                  <td className="px-4 py-2">Ghc9.99</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">2025-04-03</td>
                  <td className="px-4 py-2">Visa</td>
                  <td className="px-4 py-2 text-green-600">Successful</td>
                  <td className="px-4 py-2">Ghc14.99</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editIndex !== null
                ? "Edit Payment Method"
                : "Add Payment Method"}
            </h3>
            <form className="space-y-4" onSubmit={handleAddOrEditMethod}>
              <div>
                <label className="block mb-1">Payment Type</label>
                <select
                  value={methodType}
                  onChange={(e) => {
                    const value = e.target.value as
                      | "Credit Card"
                      | "Mobile Money";
                    setMethodType(value);
                    setProvider(value === "Credit Card" ? "Visa" : "MTN");
                  }}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 text-black"
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Mobile Money">Mobile Money</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 text-black"
                >
                  {methodType === "Credit Card" ? (
                    <>
                      <option>Visa</option>
                      <option>Mastercard</option>
                      <option>American Express</option>
                    </>
                  ) : (
                    <>
                      <option>MTN</option>
                      <option>Telecel</option>
                      <option>AirtelTigo</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block mb-1">
                  {methodType === "Credit Card"
                    ? "Card Number"
                    : "Mobile Number"}
                </label>
                <input
                  required
                  type={methodType === "Credit Card" ? "text" : "tel"}
                  placeholder={
                    methodType === "Credit Card"
                      ? "1234 5678 9012 3456"
                      : "0241234567"
                  }
                  value={accountInfo}
                  onChange={(e) => setAccountInfo(e.target.value)}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 text-black"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  {editIndex !== null ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
