import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWallet } from "../../store/slices/assetsSlice";
import AnimatedHeading from "../animation/AnimateHeading";
import OpenPerpetualPositions from "../trade/OpenPerpetualPositions";
import { fetchOpenPositions } from "../../store/slices/futuresTradeSlice";
import { fetchMarketData } from "../../store/slices/marketSlice";
import { useParams } from "react-router-dom";

const Assets = ({ type }) => {
  const dispatch = useDispatch();
  const { wallet } = useSelector((state) => state.assets);
  const { openPositions } = useSelector((state) => state.futures);
  const { coins } = useSelector((state) => state.market);
  const [usdtData, setUsdtData] = useState(null);

  const [assetType, setAssetType] = useState(type);
  useEffect(() => {
    dispatch(fetchMarketData());
    if (type === "spot") {
      dispatch(getWallet());
      setAssetType("");
    } else if (type === "futures") {
      dispatch(fetchOpenPositions());
      setAssetType("Futures Open Positions");
    } else if (type === "perpetuals") {
      setAssetType("Perpetuals Open Positions");
    }
  }, [dispatch, type]);

  useEffect(() => {
    if (coins.length > 0) {
      setUsdtData(getCoinData("USDT"));
    }
  }, [coins]);

  const getCoinData = (symbol) => {
    return coins.find(
      (coin) => coin.symbol.toUpperCase() === symbol.toUpperCase()
    );
  };

  const calculateValue = (marketPrice, quantity) => {
    if (!marketPrice) return 0
    return marketPrice * quantity;
  };

  const currentMarketPrice =
    coins.length > 0 ? coins[coins.length - 1].close : 0;

  return (
    <div className="min-h-screen max-w-7xl mx-auto">
      <div className="block md:hidden">
        {type === "spot" ? (
          wallet?.holdings?.length > 0 ? (
            <>
              <div className=" border-b text-gray-500">
                {/* Left Section */}
                <div className="flex items-center gap-3">
                  <img
                    src={usdtData?.image}
                    alt={usdtData?.name}
                    className="w-8 h-8"
                  />
                  <div>
                    <h2 className="text-white font-bold ">USDT</h2>
                  </div>
                </div>
                <div className="flex justify-between my-2">
                  <div className="text-sm text-center flex flex-col gap-2">
                    <span>Available Balance</span>

                    <p className="font-semibold text-gray-300">
                      {wallet?.spotWallet?.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-sm text-center flex flex-col gap-2">
                    <span>Frozen Amount</span>

                    <p className="font-semibold text-gray-300">
                      <p className="font-semibold text-gray-300">
                        {wallet.frozenAssets
                          .find((element) => element.asset === "USDT")
                          ?.quantity?.toFixed(2) || "0"}
                      </p>
                    </p>
                  </div>
                  <div className="text-sm text-center flex flex-col gap-2">
                    <span>Valuation</span>
                    <p className=" font-semibold text-gray-300">
                      ≈ ${wallet.spotWallet || "0"}
                    </p>
                  </div>
                </div>
              </div>
              {wallet?.holdings?.map((holding, index) => {
                const coinData = getCoinData(holding.asset);
                return (
                  <div key={index} className=" p-3 border-b text-gray-400">
                    <div className="flex items-center gap-3">
                      <img
                        src={coinData?.image}
                        alt={coinData?.name}
                        className="w-8 h-8"
                      />
                      <div>
                        <h2 className="text-white font-bold ">
                          {holding?.asset?.toUpperCase()}
                        </h2>
                      </div>
                    </div>
                    <div className="flex justify-between my-2">
                      <div className="text-sm text-center flex flex-col gap-2">
                        <span>Available Balance</span>

                        <p className="font-semibold text-gray-300">
                          {holding.quantity?.toFixed(5)}
                        </p>
                      </div>
                      <div className="text-sm text-center flex flex-col gap-2">
                        <span>Frozen Amount</span>

                        <p className="font-semibold text-gray-300">
                          <p className="font-semibold text-gray-300">
                            {wallet.frozenAssets
                              .find(
                                (element) => element.asset === holding.asset
                              )
                              ?.quantity?.toFixed(2) || "0"}
                          </p>
                        </p>
                      </div>
                      <div className=" text-sm text-center flex flex-col gap-2">
                        <span>Valuation</span>
                        <p className=" font-semibold text-gray-300">
                          ≈ $
                          {calculateValue(coinData?.current_price, holding.quantity).toFixed(5) || "0"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className={`px-3 py-1 rounded-md bg-red-500`}>
              <p>You Have No Assets Yet</p>
            </div>
          )
        ) : type === "futures" ? (
          <div className="mt-6 overflow-x-auto">
            <div className=" border-b text-gray-500">
              {/* Left Section */}
              <div className="flex items-center gap-3">
                <img
                  src={usdtData?.image}
                  alt={usdtData?.name}
                  className="w-8 h-8"
                />
                <div>
                  <h2 className="text-white font-bold ">USDT</h2>
                </div>
              </div>
              <div className="flex justify-between my-2">
                <div className="text-sm text-center flex flex-col gap-2">
                  <span>Available Balance</span>

                  <p className="font-semibold text-gray-300">
                    {wallet?.futuresWallet?.toFixed(2)}
                  </p>
                </div>
                <div className="text-sm text-center flex flex-col gap-2">
                  <span>Frozen Amount</span>

                  <p className="font-semibold text-gray-300">
                    <p className="font-semibold text-gray-300">
                      {wallet.frozenAssets
                        .find((element) => element.asset === "USDT")
                        ?.quantity?.toFixed(2) || "0"}
                    </p>
                  </p>
                </div>
                <div className="text-sm text-center flex flex-col gap-2">
                  <span>Valuation</span>
                  <p className=" font-semibold text-gray-300">
                    ≈ ${usdtData?.current_price?.toFixed(2) || "0"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-transparent p-2  mb-4">
              {openPositions?.length > 0 ? (
                <table className="w-full text-white">
                  <tbody>
                    {openPositions.map((trade) => {
                      const coinData = getCoinData(trade.pair.split("USDT")[0]);
                      return (
                        <tr
                          key={trade._id}
                          className="border-b border-gray-700"
                        >
                          <td className="py-2 flex items-center gap-3">
                            <img
                              src={coinData?.image}
                              alt={coinData?.name}
                              className="w-6 h-6"
                            />
                            <span>{coinData?.name}</span>
                          </td>
                          <td className="py-2 capitalize">{trade.type}</td>
                          <td className="py-2">{trade.leverage}x</td>
                          <td className="py-2">
                            ${trade?.entryPrice?.toFixed(2)}
                          </td>
                          <td className="py-2 text-red-500 hidden md:table-cell">
                            ${trade?.liquidationPrice?.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400">No open positions</p>
              )}
            </div>
          </div>
        ) : type === "perpetuals" ? (
          <div className="mt-6 overflow-x-auto">
            <div className=" border-b text-gray-500">
              {/* Left Section */}
              <div className="flex items-center gap-3">
                <img
                  src={usdtData?.image}
                  alt={usdtData?.name}
                  className="w-8 h-8"
                />
                <div>
                  <h2 className="text-white font-bold ">USDT</h2>
                </div>
              </div>
              <div className="flex justify-between my-2">
                <div className="text-sm text-center flex flex-col gap-2">
                  <span>Available Balance</span>

                  <p className="font-semibold text-gray-300">
                    {wallet?.perpetualsWallet?.toFixed(2)}
                  </p>
                </div>
                <div className="text-sm text-center flex flex-col gap-2">
                  <span>Frozen Amount</span>

                  <p className="font-semibold text-gray-300">
                    <p className="font-semibold text-gray-300">
                      {wallet.frozenAssets
                        .find((element) => element.asset === "USDT")
                        ?.quantity?.toFixed(2) || "0"}
                    </p>
                  </p>
                </div>
                <div className="text-sm text-center flex flex-col gap-2">
                  <span>Valuation</span>
                  <p className=" font-semibold text-gray-300">
                    ≈ ${usdtData?.current_price?.toFixed(2) || "0"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-transparent border border-[#2f2f2f] p-4 mb-4">
              <OpenPerpetualPositions
                marketPrice={currentMarketPrice}
                showBtn={false}
              />
            </div>
          </div>
        ) : (
          type === "exchange" && (
            <>
              <div className=" border-b text-gray-500">
                {/* Left Section */}
                <div className="flex items-center gap-3">
                  <img
                    src={usdtData?.image}
                    alt={usdtData?.name}
                    className="w-8 h-8"
                  />
                  <div>
                    <h2 className="text-white font-bold ">USDT</h2>
                  </div>
                </div>
                <div className="flex justify-between my-2">
                  <div className="text-sm text-center flex flex-col gap-2">
                    <span>Available Balance</span>

                    <p className="font-semibold text-gray-300">
                      {wallet?.exchangeWallet?.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-sm text-center flex flex-col gap-2">
                    <span>Frozen Amount</span>

                    <p className="font-semibold text-gray-300">
                      <p className="font-semibold text-gray-300">
                        {wallet.frozenAssets
                          .find((element) => element.asset === "USDT")
                          ?.quantity?.toFixed(2) || "0"}
                      </p>
                    </p>
                  </div>
                  <div className="text-sm text-center flex flex-col gap-2">
                    <span>Valuation</span>
                    <p className=" font-semibold text-gray-300">
                      ≈ ${usdtData?.current_price?.toFixed(2) || "0"}
                    </p>
                  </div>
                </div>
              </div>
              {wallet?.exchangeHoldings?.length > 0 && (
                <>
                  {wallet?.holdings?.map((holding, index) => {
                    const coinData = getCoinData(holding.asset);
                    return (
                      <div key={index} className=" p-3 border-b text-gray-400">
                        {/* Left Section */}
                        <div className="flex items-center gap-3">
                          <img
                            src={coinData?.image}
                            alt={coinData?.name}
                            className="w-8 h-8"
                          />
                          <div>
                            <h2 className="text-white font-bold ">
                              {holding?.asset?.toUpperCase()}
                            </h2>
                          </div>
                        </div>
                        <div className="flex justify-between my-2">
                          <div className="text-sm text-center flex flex-col">
                            <span>Available Balance</span>

                            <p className="font-semibold text-gray-300">
                              {holding.quantity?.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-sm text-center flex flex-col gap-2">
                            <span>Frozen Amount</span>

                            <p className="font-semibold text-gray-300">
                              <p className="font-semibold text-gray-300">
                                {wallet.frozenAssets
                                  .find(
                                    (element) => element.asset === holding.asset
                                  )
                                  ?.quantity?.toFixed(2) || "0"}
                              </p>
                            </p>
                          </div>
                          <div className=" text-sm text-right flex flex-col">
                            <span>Valuation</span>
                            <p className=" font-semibold text-gray-300">
                              ≈ ${coinData?.current_price?.toFixed(2) || "0"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Assets;
