import axios from "axios";
import { Button, Card } from "flowbite-react";
import React, { useEffect, useState } from "react";

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    fetchTransactions();
  }, []);
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/transactions"
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };
  return (
    <div>
      <div className="p-6 min-h-screen rounded-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Transaction Approvals</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">Transaction ID</th>
              <th className="border-b p-2">Type</th>
              <th className="border-b p-2">Amount</th>
              <th className="border-b p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx._id}>
                  <td className="border-b p-2">{tx._id}</td>
                  <td className="border-b p-2">{tx.type}</td>
                  <td className="border-b p-2">${tx.amount}</td>
                  <td className="border-b p-2">
                    <Button className="bg-green-500 text-white px-2 py-1 mr-2">
                      Approve
                    </Button>
                    <Button className="bg-red-500 text-white px-2 py-1">
                      Reject
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                {" "}
                <td colSpan="4" className="border-b p-2 text-center">
                  No transaction record found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTransactions;
