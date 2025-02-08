import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { addTrade } from '../../store/slices/tradeSlice';

function OrderForm({ coin }) {
  const dispatch = useDispatch();
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trade = {
      id: Date.now(),
      pair: `${coin?.symbol?.toUpperCase()}/USDT`,
      type: orderType,
      side,
      amount: parseFloat(amount),
      price: orderType === 'market' ? coin?.current_price : parseFloat(price),
      total: parseFloat(amount) * (orderType === 'market' ? coin?.current_price : parseFloat(price)),
      timestamp: new Date().toISOString(),
    };
    dispatch(addTrade(trade));
    setAmount('');
    setPrice('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex gap-2 mb-6">
        <button
          className={`flex-1 btn ${side === 'buy' ? 'btn-success' : 'bg-dark/50'}`}
          onClick={() => setSide('buy')}
        >
          Buy
        </button>
        <button
          className={`flex-1 btn ${side === 'sell' ? 'btn-danger' : 'bg-dark/50'}`}
          onClick={() => setSide('sell')}
        >
          Sell
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {['market', 'limit', 'stop'].map((type) => (
          <button
            key={type}
            className={`flex-1 btn ${orderType === type ? 'btn-primary' : 'bg-dark/50'}`}
            onClick={() => setOrderType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-2">Amount ({coin?.symbol?.toUpperCase()})</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input w-full"
            placeholder="0.00"
            required
          />
        </div>

        {orderType !== 'market' && (
          <div>
            <label className="block text-sm mb-2">Price (USDT)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input w-full"
              placeholder="0.00"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm mb-2">Total (USDT)</label>
          <input
            type="text"
            value={
              amount && (orderType === 'market' ? amount * coin?.current_price : amount * price) || ''
            }
            className="input w-full"
            disabled
            placeholder="0.00"
          />
        </div>

        <button
          type="submit"
          className={`w-full btn ${side === 'buy' ? 'btn-success' : 'btn-danger'}`}
        >
          {side === 'buy' ? 'Buy' : 'Sell'} {coin?.symbol?.toUpperCase()}
        </button>
      </form>
    </motion.div>
  );
}

export default OrderForm;