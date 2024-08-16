import React, { useState } from 'react';

const CompoundInterestCalculator = ({ onClose }) => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [compounds, setCompounds] = useState('');
  const [result, setResult] = useState(null);

  const calculateCompoundInterest = () => {
    if (!principal || !rate || !time || !compounds) {
      alert("Please fill all fields.");
      return;
    }

    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    const n = parseFloat(compounds);

    const A = P * Math.pow((1 + r / n), (n * t));
    const CI = A - P;

    setResult({
      totalAmount: A.toFixed(2),
      compoundInterest: CI.toFixed(2),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <button
          className="absolute top-4 right-4 text-white text-3xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-4xl font-bold mb-6 text-center text-white">Compound Interest Calculator</h2>

        <div className="space-y-6">
          <div className="flex flex-col">
            <label className="text-white text-lg font-semibold">Principal Amount ($)</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="p-3 rounded-lg bg-gray-700 text-white text-lg"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white text-lg font-semibold">Annual Interest Rate (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="p-3 rounded-lg bg-gray-700 text-white text-lg"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white text-lg font-semibold">Time (Years)</label>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="p-3 rounded-lg bg-gray-700 text-white text-lg"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white text-lg font-semibold">Compounding Frequency (Times per Year)</label>
            <input
              type="number"
              value={compounds}
              onChange={(e) => setCompounds(e.target.value)}
              className="p-3 rounded-lg bg-gray-700 text-white text-lg"
            />
          </div>

          <button
            onClick={calculateCompoundInterest}
            className="w-full p-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity text-lg"
          >
            Calculate
          </button>

          {result && (
            <div className="bg-gray-700 p-6 rounded-lg mt-6">
              <h3 className="text-3xl font-semibold text-white">Results:</h3>
              <p className="text-white text-lg">Total Amount: ${result.totalAmount}</p>
              <p className="text-white text-lg">Compound Interest: ${result.compoundInterest}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompoundInterestCalculator;
