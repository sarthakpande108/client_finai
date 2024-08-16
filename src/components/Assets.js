import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import { notification } from "antd"; // Import Ant Design notification

const Assets = () => {
  const navigate = useNavigate();
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyExpenditure, setMonthlyExpenditure] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [emergencyFund, setEmergencyFund] = useState("");
  const [hasInvestments, setHasInvestments] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [investmentType, setInvestmentType] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [showInvestmentFields, setShowInvestmentFields] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(null);
  const [insurance, setInsurance] = useState([]);
  const [insuranceType, setInsuranceType] = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [premium, setPremium] = useState("");
  const [coverage, setCoverage] = useState("");
  const [showInsuranceFields, setShowInsuranceFields] = useState(false);
  const [hasLoans, setHasLoans] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loanType, setLoanType] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [installamount, setInstallamount] = useState("");
  const [installpaid, setInstallpaid] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [showLoanFields, setShowLoanFields] = useState(false);
  const [userId, setUserId] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);

    const fetchAssetByUserId = async (userId) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/assets/${userId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const asset = await response.json();
        setMonthlyIncome(asset.monthlyIncome || "");
        setMonthlyExpenditure(asset.monthlyExpenditure || "");
        setCurrentSavings(asset.currentSavings || "");
        setEmergencyFund(asset.emergencyFund || "");
        if (asset.investments) {
          setInvestments(asset.investments || []);
          setHasInvestments(asset.investments.length > 0);
        }
        if (asset.insurance) {
          setInsurance(asset.insurance || []);
          setHasInsurance(asset.insurance.length > 0);
        }
        if (asset.loans) {
          setLoans(asset.loans || []);
          setHasLoans(asset.loans.length > 0);
        }
      } catch (error) {
        console.error("Error fetching asset:", error);
      }
    };

    if (id) {
      fetchAssetByUserId(id);
    }
  }, [userId,API_BASE_URL]);

  const addInvestment = () => {
    if (investmentType && investmentAmount) {
      setInvestments([
        ...investments,
        { type: investmentType, amount: investmentAmount },
      ]);
      setInvestmentType("");
      setInvestmentAmount("");
      setShowInvestmentFields(false);
      notification.success({
        message: 'Investment Added',
        description: 'Your investment has been successfully added.',
      });
    } else {
      notification.error({
        message: 'Input Error',
        description: 'Please fill in all fields to add the investment.',
      });
    }
  };

  const addInsurance = () => {
    if (insuranceType && insuranceProvider && premium && coverage) {
      setInsurance([
        ...insurance,
        { type: insuranceType, provider: insuranceProvider, premium, coverage },
      ]);
      setInsuranceType("");
      setInsuranceProvider("");
      setPremium("");
      setCoverage("");
      setShowInsuranceFields(false);
      notification.success({
        message: 'Insurance Added',
        description: 'Your insurance information has been successfully added.',
      });
    } else {
      notification.error({
        message: 'Input Error',
        description: 'Please fill in all fields to add the insurance.',
      });
    }
  };

  const addLoan = () => {
    if (
      loanType &&
      loanAmount &&
      interestRate &&
      installamount &&
      installpaid &&
      startDate &&
      expiryDate
    ) {
      setLoans([
        ...loans,
        {
          type: loanType,
          amount: loanAmount,
          interest: interestRate,
          installamount: installamount,
          installpaid: installpaid,
          startDate,
          expiryDate,
        },
      ]);
      setLoanType("");
      setLoanAmount("");
      setInterestRate("");
      setInstallamount("");
      setInstallpaid("");
      setStartDate("");
      setExpiryDate("");
      setShowLoanFields(false);
      notification.success({
        message: 'Loan Added',
        description: 'Your loan information has been successfully added.',
      });
    } else {
      notification.error({
        message: 'Input Error',
        description: 'Please fill in all fields to add the loan.',
      });
    }
  };

  const handleDelete = (type, index) => {
    let updatedList = [];
    if (type === "investment") {
      updatedList = investments.filter((_, i) => i !== index);
      setInvestments(updatedList);
      if (updatedList.length === 0) setHasInvestments(false);
      notification.success({
        message: 'Investment Deleted',
        description: 'The investment has been successfully removed.',
      });
    } else if (type === "insurance") {
      updatedList = insurance.filter((_, i) => i !== index);
      setInsurance(updatedList);
      if (updatedList.length === 0) setHasInsurance(false);
      notification.success({
        message: 'Insurance Deleted',
        description: 'The insurance information has been successfully removed.',
      });
    } else if (type === "loan") {
      updatedList = loans.filter((_, i) => i !== index);
      setLoans(updatedList);
      if (updatedList.length === 0) setHasLoans(false);
      notification.success({
        message: 'Loan Deleted',
        description: 'The loan information has been successfully removed.',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const assetsData = {
      userId,
      monthlyIncome,
      monthlyExpenditure,
      currentSavings,
      emergencyFund,
      investments,
      insurance,
      loans,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/assets`,
        assetsData
      );

      if (response.status === 201 || response.status === 200) {
        notification.success({
          message: 'Data Saved',
          description: 'Your asset information has been saved successfully.',
        });
        navigate("/financial-goals");
      } else {
        console.error("Unexpected response status:", response.status);
        notification.error({
          message: 'Submission Error',
          description: 'There was an error submitting the form. Please try again later.',
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      notification.error({
        message: 'Submission Error',
        description: 'There was an error submitting the form. Please try again later.',
      });
    }
  };
  return (
    <div
      className="min-h-screen bg-black text-white bg-cover bg-center"
      style={{ backgroundImage: "url(/intro.avif)" }}
    >
      <div className="container mx-auto p-6 bg-transparent min-h-screen ">
        <h1 className="text-4xl font-bold mb-6" style={{ marginTop: "50px" }}>
          Assets
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white">Monthly Income</label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Monthly Income"
                required
              />
            </div>
            <div>
              <label className="block text-white">Monthly Expenditure</label>
              <input
                type="number"
                value={monthlyExpenditure}
                onChange={(e) => setMonthlyExpenditure(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Monthly Expenditure"
                required
              />
            </div>
            <div>
              <label className="block text-white">Current Savings</label>
              <input
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Current Savings"
                required
              />
            </div>
            <div>
              <label className="block text-white">Emergency Fund</label>
              <input
                type="number"
                value={emergencyFund}
                onChange={(e) => setEmergencyFund(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Emergency Fund"
                required
              />
            </div>
          </div>

          {/* Investments Section */}
          <div>
            <label className="block text-white">
              Do you have any current investments?
            </label>
            <div className="flex items-center space-x-4">
              <label className="text-white">
                <input
                  type="radio"
                  name="investments"
                  checked={hasInvestments === true}
                  onChange={() => setHasInvestments(true)}
                  className="mr-2"
                  style={{ transform: "scale(1.5)" }}
                />
                Yes
              </label>
              <label className="text-white">
                <input
                  type="radio"
                  name="investments"
                  checked={hasInvestments === false}
                  onChange={() => setHasInvestments(false)}
                  className="mr-2"
                  style={{ transform: "scale(1.5)" }}
                />
                No
              </label>
            </div>
            {hasInvestments === true && (
              <div className="space-y-4 mt-4">
                {showInvestmentFields && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white">
                        Investment Type
                      </label>
                      <input
                        type="text"
                        value={investmentType}
                        onChange={(e) => setInvestmentType(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Investment Type"
                      />
                    </div>
                    <div>
                      <label className="block text-white">
                        Amount Invested
                      </label>
                      <input
                        type="number"
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Amount Invested"
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-2 mt-4">
                  {!showInvestmentFields && (
                    <button
                      type="button"
                      onClick={() => setShowInvestmentFields(true)}
                      className="text-white bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-md hover:bg-opacity-80"
                      style={{
                        background: "linear-gradient(45deg, #00f260, #0575e6)",
                      }}
                    >
                      <FaPlus className="inline mr-2" /> Add Investment
                    </button>
                  )}
                  {showInvestmentFields && (
                    <button
                      type="button"
                      onClick={addInvestment}
                      className="text-white bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-md hover:bg-opacity-80"
                      style={{
                        background: "linear-gradient(45deg, #00f260, #0575e6)",
                      }}
                    >
                      Save Investment
                    </button>
                  )}
                </div>
                {investments.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-white border border-gray-700">
                      <thead>
                        <tr>
                          <th className="border border-gray-600 bg-gray-800 px-4 py-2">
                            Investment Type
                          </th>
                          <th className="border border-gray-600 bg-gray-800 px-4 py-2">
                            Amount
                          </th>
                          <th className="border border-gray-600 bg-gray-800 px-4 py-2">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {investments.map((investment, index) => (
                          <tr key={index}>
                            <td className="border border-gray-600 px-4 py-2">
                              {investment.type}
                            </td>
                            <td className="border border-gray-600 px-4 py-2">
                              {investment.amount}
                            </td>
                            <td className="border border-gray-600 px-4 py-2">
                              <button
                                onClick={() =>
                                  handleDelete("investment", index)
                                }
                                className="text-red-500"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Insurance Section */}
          <div>
            <label className="block text-white">
              Do you have any insurance policies?
            </label>
            <div className="flex items-center space-x-4">
              <label className="text-white">
                <input
                  type="radio"
                  name="insurance"
                  checked={hasInsurance === true}
                  onChange={() => setHasInsurance(true)}
                  className="mr-2"
                  style={{ transform: "scale(1.5)" }}
                />
                Yes
              </label>
              <label className="text-white">
                <input
                  type="radio"
                  name="insurance"
                  checked={hasInsurance === false}
                  onChange={() => setHasInsurance(false)}
                  className="mr-2"
                  style={{ transform: "scale(1.5)" }}
                />
                No
              </label>
            </div>
            {hasInsurance === true && (
              <div className="space-y-4 mt-4">
                {showInsuranceFields && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white">Insurance Type</label>
                      <input
                        type="text"
                        value={insuranceType}
                        onChange={(e) => setInsuranceType(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Insurance Type"
                      />
                    </div>
                    <div>
                      <label className="block text-white">
                        Insurance Provider
                      </label>
                      <input
                        type="text"
                        value={insuranceProvider}
                        onChange={(e) => setInsuranceProvider(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Insurance Provider"
                      />
                    </div>
                    <div>
                      <label className="block text-white">Premium Amount</label>
                      <input
                        type="number"
                        value={premium}
                        onChange={(e) => setPremium(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Premium Amount"
                      />
                    </div>
                    <div>
                      <label className="block text-white">
                        Coverage Amount
                      </label>
                      <input
                        type="number"
                        value={coverage}
                        onChange={(e) => setCoverage(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Coverage Amount"
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-2 mt-4">
                  {!showInsuranceFields && (
                    <button
                      type="button"
                      onClick={() => setShowInsuranceFields(true)}
                      className="text-white bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-md hover:bg-opacity-80"
                      style={{
                        background: "linear-gradient(45deg, #00f260, #0575e6)",
                      }}
                    >
                      <FaPlus className="inline mr-2" /> Add Insurance
                    </button>
                  )}
                  {showInsuranceFields && (
                    <button
                      type="button"
                      onClick={addInsurance}
                      className="text-white bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-md hover:bg-opacity-80"
                      style={{
                        background: "linear-gradient(45deg, #00f260, #0575e6)",
                      }}
                    >
                      Save Insurance
                    </button>
                  )}
                </div>
                {insurance.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-white border border-gray-700">
                      <thead>
                        <tr>
                          <th className="border border-gray-600 bg-gray-800 px-4 py-2">
                            Insurance Type
                          </th>
                          <th className="border border-gray-600 bg-gray-800 px-4 py-2">
                            Provider
                          </th>
                          <th className="border border-gray-600 bg-gray-800 px-4 py-2">
                            Premium
                          </th>
                          <th className="border border-gray-600 bg-gray-800 px-4 py-2">
                            Coverage
                          </th>
                          <th className="border border-gray-600 bg-gray-800 px-4 py-2">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {insurance.map((item, index) => (
                          <tr key={index}>
                            <td className="border border-gray-600 px-4 py-2">
                              {item.type}
                            </td>
                            <td className="border border-gray-600 px-4 py-2">
                              {item.provider}
                            </td>
                            <td className="border border-gray-600 px-4 py-2">
                              {item.premium}
                            </td>
                            <td className="border border-gray-600 px-4 py-2">
                              {item.coverage}
                            </td>
                            <td className="border border-gray-600 px-4 py-2">
                              <button
                                onClick={() => handleDelete("insurance", index)}
                                className="text-red-500"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Loans Section */}
          <div>
            <label className="block text-white">Do you have any loans?</label>
            <div className="flex items-center space-x-4">
              <label className="text-white">
                <input
                  type="radio"
                  name="loans"
                  checked={hasLoans === true}
                  onChange={() => setHasLoans(true)}
                  className="mr-2"
                  style={{ transform: "scale(1.5)" }}
                />
                Yes
              </label>
              <label className="text-white">
                <input
                  type="radio"
                  name="loans"
                  checked={hasLoans === false}
                  onChange={() => setHasLoans(false)}
                  className="mr-2"
                  style={{ transform: "scale(1.5)" }}
                />
                No
              </label>
            </div>
            {hasLoans === true && (
              <div className="space-y-4 mt-4">
                {showLoanFields && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white">Loan Type</label>
                      <input
                        type="text"
                        value={loanType}
                        onChange={(e) => setLoanType(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Loan Type"
                      />
                    </div>
                    <div>
                      <label className="block text-white">Loan Amount</label>
                      <input
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Loan Amount"
                      />
                    </div>
                    <div>
                      <label className="block text-white">
                        Interest Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Interest Rate (%)"
                      />
                    </div>
                    <div>
                      <label className="block text-white">
                        Installment Amount
                      </label>
                      <input
                        type="number"
                        value={installamount}
                        onChange={(e) => setInstallamount(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Installment Amount"
                      />
                    </div>
                    <div>
                      <label className="block text-white">
                        Total Installment Paid
                      </label>
                      <input
                        type="number"
                        value={installpaid}
                        onChange={(e) => setInstallpaid(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Number of Installment Paid"
                      />
                    </div>
                    <div>
                      <label className="block text-white">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white">Expiry Date</label>
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-2 mt-4">
                  {!showLoanFields && (
                    <button
                      type="button"
                      onClick={() => setShowLoanFields(true)}
                      className="text-white bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-md hover:bg-opacity-80"
                      style={{
                        background: "linear-gradient(45deg, #00f260, #0575e6)",
                      }}
                    >
                      <FaPlus className="inline mr-2" /> Add Loan
                    </button>
                  )}
                  {showLoanFields && (
                    <button
                      type="button"
                      onClick={addLoan}
                      className="text-white bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-md hover:bg-opacity-80"
                      style={{
                        background: "linear-gradient(45deg, #00f260, #0575e6)",
                      }}
                    >
                      Save Loan
                    </button>
                  )}
                </div>
                {loans.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-white border border-gray-700">
                      <thead>
                        <tr>
                          <th className="border border-gray-600 bg-gray-800 px-4 py-2">
                            Loan Type
                          </th>
                          <th className="border border-gray-600 bg-gray-800 px-4 py-2">
                            Amount
                          </th>
                          <th className="border border-gray-600 bg-gray-800 px-4 py-2">
                            Interest Rate
                          </th>
                          <th className="border border-gray-600 bg-gray-800 px-4 py-2">
                            Installment Amount
                          </th>
                          <th className="border border-gray-600 bg-gray-800 px-4 py-2">
                            Installment Paid
                          </th>
                          <th className="border border-gray-600 bg-gray-800 px-4 py-2">
                            Start Date
                          </th>
                          <th className="border border-gray-600 bg-gray-800 px-4 py-2">
                            Expiry Date
                          </th>
                          <th className="border border-gray-600 bg-gray-800 px-4 py-2">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loans.map((loan, index) => (
                          <tr key={index}>
                            <td className="border border-gray-600 px-4 py-2">
                              {loan.type}
                            </td>
                            <td className="border border-gray-600 px-4 py-2">
                              {loan.amount}
                            </td>
                            <td className="border border-gray-600 px-4 py-2">
                              {loan.interest}
                            </td>
                            <td className="border border-gray-600 px-4 py-2">
                              {loan.installamount}
                            </td>
                            <td className="border border-gray-600 px-4 py-2">
                              {loan.installpaid}
                            </td>
                            <td className="border border-gray-600 px-4 py-2">
                              {loan.startDate}
                            </td>
                            <td className="border border-gray-600 px-4 py-2">
                              {loan.expiryDate}
                            </td>
                            <td className="border border-gray-600 px-4 py-2">
                              <button
                                onClick={() => handleDelete("loan", index)}
                                className="text-red-500 "
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="text-white bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-md hover:bg-opacity-80"
              style={{ background: "linear-gradient(45deg, #00f260, #0575e6)" }}
            >
              Back to Profile
            </button>
            <button
              type="submit"
              className="text-white bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-md hover:bg-opacity-80"
              style={{ background: "linear-gradient(45deg, #00f260, #0575e6)" }}
            >
              Save & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Assets;