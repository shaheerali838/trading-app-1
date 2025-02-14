import { useState } from "react";
import { useDispatch } from "react-redux";
import AnimatedHeading from "../../components/animation/AnimateHeading";
import { fundsRequest } from "../../store/slices/assetsSlice";

function RequestRelease() {
  const dispatch = useDispatch();
  const [requestData, setRequestData] = useState({
    amount: "",
    currency: "USDT",
    accountName: "",
    accountNumber: "",
    type: "deposit",
  });
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(fundsRequest(requestData));
    console.log(`type : ${requestData.type}`);

    setRequestData({
      amount: "",
      currency: "USDT",
      accountName: "",
      accountNumber: "",
      type: "deposit",
    });
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
              value={requestData.amount}
              onChange={(e) =>
                setRequestData({ ...requestData, amount: e.target.value })
              }
              className="input w-full ring-[.3px] px-2 py-1 rounded-sm ring-[#00c853] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              value={requestData.currency}
              onChange={(e) =>
                setRequestData({ ...requestData, currency: e.target.value })
              }
              className="input w-full ring-[.3px] px-2 py-1 rounded-sm ring-[#00c853] focus:outline-none"
            >
              <option className="text-black hover:bg-tertiary3" value="USDT">
                USDT
              </option>
              <option className="text-black hover:bg-tertiary3" value="USDC">
                PKR
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={requestData.type}
              onChange={(e) =>
                setRequestData({ ...requestData, type: e.target.value })
              }
              className="input w-full ring-[.3px] px-2 py-1 rounded-sm ring-[#00c853] focus:outline-none"
            >
              <option className="text-black hover:bg-tertiary3" value="deposit">
                deposit
              </option>
              <option
                className="text-black hover:bg-tertiary3"
                value="withdraw"
              >
                withdraw
              </option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Account Name
            </label>
            <input
              type="text"
              value={requestData.accountName}
              onChange={(e) =>
                setRequestData({ ...requestData, accountName: e.target.value })
              }
              className="input w-full ring-[.3px] px-2 py-1 rounded-sm ring-[#00c853] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Account Number
            </label>
            <input
              type="text"
              value={requestData.accountNumber}
              onChange={(e) =>
                setRequestData({...requestData, accountNumber: e.target.value })
              }
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
      </div>
    </div>
  );
}

export default RequestRelease;
