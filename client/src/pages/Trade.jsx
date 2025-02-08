import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchCoinData } from '../store/slices/tradeSlice';
import TradingChart from '../components/trade/TradingChart';
import OrderForm from '../components/trade/OrderForm';
import RecentTrades from '../components/trade/RecentTrades';

function Trade() {
  const { symbol } = useParams();
  const dispatch = useDispatch();
  const { chartData, status, recentTrades } = useSelector((state) => state.trade);
  const { coins } = useSelector((state) => state.market);
  const selectedCoin = coins.find(coin => coin.symbol.toLowerCase() === symbol);

  useEffect(() => {
    if (selectedCoin) {
      dispatch(fetchCoinData(selectedCoin.id));
    }
  }, [dispatch, selectedCoin]);

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-6">
          {selectedCoin && (
            <>
              <img src={selectedCoin.image} alt={selectedCoin.name} className="w-10 h-10" />
              <div>
                <h1 className="text-4xl font-bold">{selectedCoin.name}</h1>
                <span className="text-light/60">{selectedCoin.symbol.toUpperCase()}/USDT</span>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card">
            {status === 'loading' && (
              <div className="h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
              </div>
            )}
            {status === 'succeeded' && chartData.length > 0 && (
              <TradingChart data={chartData} />
            )}
          </div>

          <div>
            <OrderForm coin={selectedCoin} />
          </div>
        </div>

        <div className="mt-6">
          <RecentTrades trades={recentTrades} />
        </div>
      </motion.div>
    </div>
  );
}

export default Trade;