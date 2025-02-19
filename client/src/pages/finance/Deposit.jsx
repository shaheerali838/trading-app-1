import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import bankQr from "../../assets/transaction-qr.png";
import easypaisaQr from "../../assets/transaction-qr.png";
import jazzcashQr from "../../assets/transaction-qr.png";
import AnimatedHeading from "../../components/animation/AnimateHeading";
import { Link } from "react-router-dom";

function Deposit() {
  const dispatch = useDispatch();
  const { status, depositHistory } = useSelector((state) => state.assets);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank");
  const [currency, setCurrency] = useState("USDT");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
  };

  return (
    <div className="w-full min-h-screen p-6 bg-gradient">
      <div className="flex flex-col sm:flex-row gap-4 justify-evenly">
        <form onSubmit={handleSubmit} className="space-y-6 sm:w-[40vw]">
          <div className="flex justify-between items-center mb-6">
            <AnimatedHeading>
              <h2 className="text-2xl font-bold">Deposit Funds</h2>
            </AnimatedHeading>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="input w-full ring-[.3px] px-2 py-1 rounded-sm ring-[#00c853] focus:outline-none"
            >
              <option className="text-black hover:bg-tertiary3" value="USDT">
                USDT
              </option>
              <option className="text-black hover:bg-tertiary3" value="USDC">
                USDC
              </option>
              <option className="text-black hover:bg-tertiary3" value="BTC">
                BTC
              </option>
              <option className="text-black hover:bg-tertiary3" value="ETH">
                ETH
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Network</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="input w-full ring-[.3px] px-2 py-1 rounded-sm ring-[#00c853] focus:outline-none"
            >
              <option className="text-black hover:bg-tertiary3" value="USDT">
                ERC20
              </option>
              <option className="text-black hover:bg-tertiary3" value="USDC">
                TRC20
              </option>
            </select>
          </div>
          <div className="qrCode">
            <img
              src={
                method === "bank"
                  ? bankQr
                  : method === "Easypaisa"
                  ? easypaisaQr
                  : jazzcashQr
              }
              alt="qr code"
              className="w-[10vw]"
            />
          </div>

          <div className="w-full max-w-[16rem]">
            <div className="relative">
              <label htmlFor="account-number" className="sr-only">
                Wallet Address
              </label>
              <input
                id="account-number"
                type="text"
                className="col-span-6 bg-transparent
         border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                value="1479857fhkjhfiy954945794"
                disabled
                readOnly
              />
              <button
                data-copy-to-clipboard-target="npm-install-copy-button"
                data-tooltip-target="tooltip-copy-npm-install-copy-button"
                className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
              >
                <span id="default-icon">
                  <svg
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 20"
                  >
                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                  </svg>
                </span>
                <span id="success-icon" className="hidden">
                  <svg
                    className="w-3.5 h-3.5 text-blue-700 dark:text-blue-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>  
                </span>
              </button>
              <div
                id="tooltip-copy-npm-install-copy-button"
                role="tooltip"
                className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
              >
                <span id="default-tooltip-message">Copy to clipboard</span>
                <span id="success-tooltip-message" className="hidden">
                  Copied!
                </span>
                <div className="tooltip-arrow" data-popper-arrow></div>
              </div>
            </div>
          </div>
          <Link to={"/wallet/request-release-funds"} className="text-blue-400">
            Already made a transaction? Send a request to release funds.
          </Link>
        </form>
        <div className="warning rounded-md px-8 py-8 bg-[#242424] sm:w-[40vw] max-h-fit text-start">
          <h3 className="text-yellow-200">⚠️Important Notice</h3>
          <ol className="text-gray-500 ">
            <li>
              1. The above deposit address is the official payment address of the
              platform. Please ensure you use the official deposit address of the
              platform. Any loss of funds caused by incorrect charging shall be
              borne by yourself.
            </li>
            <li>
              2. Please make sure that your computer and browser are safe to
              prevent information from being tampered with or leaked.
            </li>
            <li>
              3. After you recharge the above address, you need to confirm the
              entire network node for it to be credited.
            </li>
            <li>
              4. Please select the above-mentioned token system and currency type
              and transfer the corresponding amount for deposit. Please do not
              transfer any other irrelevant assets, otherwise, they will not be
              retrieved.
            </li>
          </ol>
        </div>
      </div>

      <div className="card mt-8">
        <AnimatedHeading>
          <h2 className="text-xl font-bold mb-4 w-full text-center">Deposit History</h2>
        </AnimatedHeading>
        <table className="min-w-full bg-dark/30 rounded-lg">
          <thead className="border-b-1 border-gray-700">
            <tr>
              <th className="py-2 px-4 text-left">Currency</th>
              <th className="py-2 px-4 text-left">Quantity</th>
              <th className="py-2 px-4 text-left">Time</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {depositHistory.length !== 0 ? (
              depositHistory.map((tx) => (
                <tr key={tx.id} className="border-t border-light/20">
                  <td className="py-2 px-4">{tx.currency}</td>
                  <td className="py-2 px-4">{tx.quantity}</td>
                  <td className="py-2 px-4">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">{tx.status}</td>
                </tr>
              ))
            ) : (
              <p className="text-light/60 w-full text-center">
                No deposit history
              </p>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Deposit;
