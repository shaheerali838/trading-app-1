import axios from "axios";
import { Button, Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRequests } from "../../store/slices/adminSlice";
import { Breadcrumbs } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import API from "../../utils/api";

const ManageTransactions = () => {
  const dispatch = useDispatch();
  const { transactions } = useSelector((state) => state.admin);
  useEffect(() => {
    dispatch(fetchRequests());
  }, []);

  const approveTransaction = (id) => {
    API.put(`/admin/requests/${id}/approve`).then(() => {
      dispatch(fetchRequests());
    });
  };

  return (
    <div className="p-6 min-h-screen rounded-lg mb-6">
      <div className="flex justify-center  h-20">
        <Link to={"/admin/dashboard"} className="opacity-60 hover:text-lg transition-all duration-300">
          Go To Home
        </Link>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Transaction Approvals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <div
              key={tx._id}
              className="p-4 bg-[#2A2A2A] rounded-lg text-gray-400"
            >
              <h3 className="text-xl font-semibold mb-2">
                Transaction ID: {tx._id}
              </h3>
              <p className="mb-2 text-gray-500">
                <strong>Account Name:</strong> {tx.accountName}
              </p>
              <p className="mb-2 text-gray-500">
                <strong>Account Number:</strong> {tx.accountNumber}
              </p>
              <p className="mb-2 text-gray-500">
                <strong>Currency Type:</strong> {tx.currency}
              </p>
              <p className="mb-2 text-gray-500">
                <strong>Amount:</strong> ${tx.amount}
              </p>
              <div className="flex justify-end mt-4">
                <Button onClick={handleApprove} className="bg-primary text-white px-4 py-2 mr-2">
                  Approve
                </Button>
                <Button className="bg-tertiary1 text-white px-4 py-2">
                  Reject
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center">
            No transaction record found
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTransactions;
