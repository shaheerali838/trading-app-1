import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import AnimatedHeading from "../../components/animation/AnimateHeading";
import { useNavigate } from "react-router-dom";
import PortfolioSummary from "../../components/finance/PortfolioSummary";

function Assets() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { balance, pendingTransactions, status, error } = useSelector(
    (state) => state.assets
  );
  const { portfolio } = useSelector(
    (state) => state.finance
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const depositHandler = () => {
    navigate("/assets/deposit");
  };
  const withdrawHandler = () => {
    navigate("/assets/withdraw");
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <AnimatedHeading>
          <h1 className="text-4xl font-bold mb-6">Assets</h1>
        </AnimatedHeading>

        <div className="ring-[.4px] ring-[#00c853] rounded-xl p-6">
          <div className="card flex justify-evenly items-center">
            <div className="flex flex-col items-center gap-1">
              <p className="text-3xl font-bold">${balance.toLocaleString()}</p>
              <h2 className="text-xl font-bold mb-4">Total Balance</h2>
            </div>
            <div className="w-[70%] grid grid-cols-2 gap-4">
              <button
                onClick={depositHandler}
                className=" btn btn-primary bg-[#242424] rounded-sm cursor-pointer py-2"
              >
                Deposit
              </button>
              <button
                onClick={withdrawHandler}
                className="flex-1 btn btn-primary bg-[#242424] rounded-sm cursor-pointer py-2"
              >
                Withdraw
              </button>
              <button
                onClick={withdrawHandler}
                className="flex-1 btn btn-primary bg-[#242424] rounded-sm cursor-pointer py-2"
              >
                Transfer
              </button>
              <button
                onClick={withdrawHandler}
                className="flex-1 btn btn-primary bg-[#242424] rounded-sm cursor-pointer py-2"
              >
                Swap
              </button>
            </div>
          </div>
        </div>
        <PortfolioSummary portfolio={portfolio}/>
        
      </motion.div>
    </div>
  );
}

export default Assets;
