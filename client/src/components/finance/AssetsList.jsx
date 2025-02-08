import { motion } from "framer-motion";
import AnimatedHeading from "../animation/AnimateHeading";

function AssetsList({ holdings }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mt-6"
    >
      <AnimatedHeading>
        <h2 className="text-xl font-bold mb-4">Your Assets</h2>
      </AnimatedHeading>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-secondary">
              <th className="pb-4">Asset</th>
              <th className="pb-4">Holdings</th>
              <th className="pb-4">Value</th>
              <th className="pb-4">Profit/Loss</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((asset) => (
              <tr key={asset.id} className="border-t border-light/10">
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{asset.name}</span>
                    <span className="text-light/60">{asset.symbol}</span>
                  </div>
                </td>
                <td className="py-4">{asset.amount}</td>
                <td className="py-4">${asset.value.toLocaleString()}</td>
                <td
                  className={`py-4 ${
                    asset.profitLoss >= 0 ? "text-success" : "text-danger"
                  }`}
                >
                  ${Math.abs(asset.profitLoss).toLocaleString()}
                  <span className="text-sm ml-1">
                    ({asset.profitLossPercentage}%)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default AssetsList;
