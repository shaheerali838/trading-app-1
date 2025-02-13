import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMarketData, setSearchTerm } from "../store/slices/marketSlice";
import GraphCard from "../components/market/GraphCard";
import AnimateSection from "../components/animation/AnimateSection";
import { Link, useHref, useNavigate } from "react-router-dom";
import AnimatedHeading from "../components/animation/AnimateHeading";
import Loader from "../components/layout/Loader";

function Market() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { coins, status, searchTerm } = useSelector((state) => state.market);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMarketData());
    }
  }, [dispatch, status]);

  console.log(coins);
  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popularCoins = filteredCoins.slice(0, 4); // Select the top 4 popular coins

  const handleBuy = () => {
    navigate("/trade");
  };

  return (
    <div className="max-w-7xl mx-8">
      <AnimateSection>
        <AnimatedHeading>
          <h1 className="text-4xl font-bold mb-4">Cryptocurrency Market</h1>
        </AnimatedHeading>

        {status === "loading" && <Loader />}

        {status === "succeeded" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {popularCoins.length > 0 &&
                popularCoins.map((coin, index) => (
                  <AnimateSection key={coin.id} delay={index * 0.1}>
                    <GraphCard coin={coin} />
                  </AnimateSection>
                ))}
            </div>

            <div className="overflow-x-auto mb-8">
              <table className="min-w-full bg-trasnsparent rounded-lg shadow-md backdrop-blur-xl">
                <thead>
                  <tr className="flex justify-evenly border-y ">
                    <th className="px-7 py-2 text-left"></th>
                    <th className="px-4 py-2 text-left w-1/5">Name</th>
                    <th className="px-4 py-2 text-left w-1/5">Symbol</th>
                    <th className="px-4 py-2 text-left w-1/5">Price</th>
                    <th className="px-4 py-2 text-left w-1/5">Market Cap</th>
                    <th className="px-4 py-2 text-left w-1/5">24h Change</th>
                    <th className="px-4 py-2 text-left w-1/5">Operation</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoins.map((coin, index) => (
                    <AnimateSection key={coin.id}>
                      <tr className="border-b-[1px] border-[#eaeaea] flex justify-evenly">
                        <td className="px-4 py-2">
                          {" "}
                          <img src={coin.image} alt="" className="w-8 inline" />
                        </td>
                        <td className="px-4 py-2 w-1/5">{coin.name}</td>
                        <td className="px-4 py-2 w-1/5">
                          {coin.symbol.toUpperCase()}
                        </td>
                        <td className="px-4 py-2 w-1/5">
                          ${coin.current_price.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 w-1/5">
                          ${coin.market_cap.toLocaleString()}
                        </td>
                        <td
                          className={`px-4 py-2 ${
                            coin.price_change_percentage_24h > 0
                              ? "text-green-500"
                              : "text-red-500"
                          } w-1/5`}
                        >
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </td>
                        <td
                          onClick={handleBuy}
                          className="px-4 py-2 w-1/5 text-primary cursor-pointer"
                        >
                          Buy
                        </td>
                      </tr>
                    </AnimateSection>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {status === "failed" && (
          <div className="text-danger text-center">
            Failed to load market data. Please try again later.
          </div>
        )}
      </AnimateSection>
    </div>
  );
}

export default Market;
