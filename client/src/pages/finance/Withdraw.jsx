import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AnimatedHeading from "../../components/animation/AnimateHeading";
import { fundsRequest } from "../../store/slices/assetsSlice";

function Withdraw() {
  const dispatch = useDispatch();
  const { withdrawalHistory } = useSelector((state) => state.assets);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USDT");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0 || !accountName || !accountNumber) {
      toast.error("Please fill in all fields with valid information");
      return;
    }

    dispatch(fundsRequest({
      amount,
      currency,
      accountName,
      accountNumber,
      type: "withdraw",
    }));
  };

  return (
    <div className="w-full min-h-screen p-6 bg-gradient ">
      <div className="flex justify-evenly">
        <form onSubmit={handleSubmit} className="space-y-6 w-[40vw]">
          <div className="flex justify-between items-center mb-6">
            <AnimatedHeading>
              <h2 className="text-2xl font-bold">Withdraw</h2>
            </AnimatedHeading>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input w-full ring-[.3px] px-2 py-1 rounded-sm ring-[#00c853] focus:outline-none"
            />
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
            <label className="block text-sm font-medium mb-2">
              Account Name
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="input w-full ring-[.3px] px-2 py-1 rounded-sm ring-[#00c853] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="input w-full ring-[.3px] px-2 py-1 rounded-sm ring-[#00c853] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full bg-primary py-1 rounded-sm cursor-pointer"
          >
            Send Request
          </button>
        </form>
        <div className="warning rounded-md px-8 py-8 bg-[#242424] w-[40vw] max-h-fit text-start">
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
              entire network node to ensure it can be credited.
            </li>
            <li>
              4. Please select the above-mentioned token system and currency type
              and transfer the corresponding amount for deposit. Please do not
              transfer any other irrelevant assets, otherwise they will not be
              retrieved.
            </li>
          </ol>
        </div>
      </div>

      <div className="card mt-8 w-full">
        <AnimatedHeading>
          <h2 className="text-xl font-bold mb-4 w-full text-center">
            Withdrawal History
          </h2>
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
            {withdrawalHistory.length !== 0 ? (
              withdrawalHistory.map((tx) => (
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
                No withdrawal history
              </p>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Withdraw;
