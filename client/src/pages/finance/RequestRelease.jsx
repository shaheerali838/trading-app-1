import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import AnimatedHeading from "../../components/animation/AnimateHeading";

function RequestRelease() {
  const dispatch = useDispatch();
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

    // Dispatch an action or make an API call here if needed

    toast.success("Request sent successfully");
    setAmount("");
    setCurrency("USDT");
    setAccountName("");
    setAccountNumber("");
  };

  return (
    <div className="w-full min-h-screen p-6 bg-gradient flex justify-center items-center">
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="space-y-6 w-[40vw]">
          <div className="flex justify-between items-center mb-6">
            <AnimatedHeading>
              <h2 className="text-2xl font-bold">Request Release of Funds</h2>
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
          <button type="submit" className="btn btn-primary w-full bg-primary py-1 rounded-sm cursor-pointer">
            Send Request
          </button>
        </form>
      </div>
    </div>
  );
}

export default RequestRelease;
