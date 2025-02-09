import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import AnimatedHeading from "../animation/AnimateHeading";

function PortfolioSummary({ portfolio }) {
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Portfolio Value",
        data: [20000, 22000, 21000, 23000, 24000, 25000],
        borderColor: "#1E90FF",
        backgroundColor: "rgba(30, 144, 255, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: "rgba(234, 234, 234, 0.1)" },
        ticks: { color: "#EAEAEA" },
      },
      y: {
        grid: { color: "rgba(234, 234, 234, 0.1)" },
        ticks: { color: "#EAEAEA" },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-8"
    >
      {/* Left (Takes 2 columns on large screens) */}
      <div className=" card w-full text-center">
        <AnimatedHeading>
          <h2 className="text-xl font-bold mb-4">Assets Summary Overview</h2>
        </AnimatedHeading>
      </div>

      {/* Right (Takes 1 column on large screens) */}
      <div className="card  flex justify-evenly">
        <div className="h-[60vh] w-[70vw]">
          <Line data={chartData} options={chartOptions} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Summary</h2>
          <div className="space-y-4">
            <div>
              <span className="text-light/60">Total Balance</span>
              <p className="text-2xl font-bold">
                ${portfolio.totalBalance.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-light/60">24h Profit/Loss</span>
              <p
                className={`text-xl font-bold ${
                  portfolio.dailyProfitLoss >= 0
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                ${Math.abs(portfolio.dailyProfitLoss).toLocaleString()}
                <span className="text-sm ml-1">
                  ({portfolio.dailyProfitLossPercentage}%)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default PortfolioSummary;
