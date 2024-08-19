import React, { useState, useEffect } from "react";
import { Layout, Button, Card, Typography, Space, Modal, Spin } from "antd";
import axios from "axios";
import { FaCalculator } from "react-icons/fa";
import CompoundInterestCalculator from "./CompoundInterestCalculator";
import logo from "../img/logo.webp";
import "../styles/Result.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "react-loading-skeleton/dist/skeleton.css";
ChartJS.register(ArcElement, Tooltip, Legend);
const { Header, Content } = Layout;
const { Title: AntTitle } = Typography;
const Result = () => {
  const [loading, setLoading] = useState(true); // Loader for page load
  const [profile, setProfile] = useState({});
  const [assets, setAssets] = useState({});
  const [financialGoal, setFinancialGoal] = useState({});
  const [isPlanLoading, setIsPlanLoading] = useState(false); // Loader for plan data
  const [generatedText, setGeneratedText] = useState(""); // For displaying generated text
  const [displayedText, setDisplayedText] = useState(""); // Text displayed with typewriter effect
  const [textIndex, setTextIndex] = useState(0); // Index for typewriter effect
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [timeoutError, setTimeoutError] = useState(false);
  const currentYear = new Date().getFullYear();
  const [marketData, setMarketData] = useState({
    interestRates: [],
    niftyReturns: {},
  });

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


  // Fetch profile, assets, and financial goals on component mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchData = async () => {
      try {
        const [profileResponse, assetsResponse, goalResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/profiles/${userId}`),
          axios.get(`${API_BASE_URL}/api/assets/${userId}`),
          axios.get(`${API_BASE_URL}/api/financialgoals/${userId}`)
        ]);

        setProfile(profileResponse.data);
        setAssets(assetsResponse.data);
        setFinancialGoal(goalResponse.data);

        const interestRates = [
          { year: "2014 - 2015", return: "8.50 - 8.75" },
          { year: "2015 - 2016", return: "7.00 - 7.50" },
          { year: "2016 - 2017", return: "6.50 - 6.90" },
          { year: "2017 - 2018", return: "6.25 - 6.70" },
          { year: "2018 - 2019", return: "6.25 - 7.25" },
          { year: "2019 - 2020", return: "5.70 - 6.40" },
          { year: "2020 - 2021", return: "5.25 - 5.35" },
          { year: "2021 - 2022", return: "5.05-5.35" }
        ];

        const niftyReturns = {
          "2014": "31.39%",
          "2015": "-4.06%",
          "2016": "3.01%",
          "2017": "28.65%",
          "2018": "3.15%",
          "2019": "12.02%",
          "2020": "14.17%",
          "2021": "24.12%",
          "2022": "4.32%",
          "2023": "9.60%",
        };

        setMarketData({ interestRates, niftyReturns });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generatePrompt = () => {
    const { name, age, occupation, maritalStatus, dependents = [] } = profile;
    const { monthlyIncome, monthlyExpenditure, currentSavings, emergencyFund, investments = [], insurance = [], loans = [] } = assets;
    const { goal, targetAmount, deadline } = financialGoal;
    const { interestRates, niftyReturns } = marketData;

    let prompt = `My name is ${name}, and I am ${age} years old, currently working as an ${occupation}. I am ${maritalStatus}.`;

    if (dependents.length > 0) {
      const dependentsDetails = dependents.map(dep => ` ${dep.relationship} ${dep.name} (${dep.age} years old)`).join(', ');
      prompt += ` I have dependents: ${dependentsDetails}.`;
    }

    prompt += ` I have set a financial goal to ${goal} by the year ${deadline}, with a target amount of ₹${targetAmount}. My monthly income is ₹${monthlyIncome}, and my monthly expenditure is ₹${monthlyExpenditure}. I have current savings of ₹${currentSavings} and an emergency fund of ₹${emergencyFund}.`;

    if (loans.length > 0) {
      const loanDetails = loans.map(loan => {
        const loanTenure = new Date(loan.expiryDate).getFullYear() - new Date(loan.startDate).getFullYear();
        const yearsPaid = new Date().getFullYear() - new Date(loan.startDate).getFullYear();
        return `${loan.type} of ₹${loan.amount} at ${loan.interest}% interest, with a monthly installment of ₹${loan.installamount}. It has a tenure of ${loanTenure} years, and ${yearsPaid} years of installments have been paid.`;
      }).join(' ');
      prompt += ` I have the following loans: ${loanDetails}`;
    }

    if (investments.length > 0) {
      const investmentDetails = investments.map(inv => ` ${inv.type} worth ₹${inv.amount}`).join(', ');
      prompt += ` I have investments in ${investmentDetails}.`;
    }

    if (insurance.length > 0) {
      const insuranceDetails = insurance.map(ins => ` ${ins.type} with ${ins.provider}, paying a premium of ₹${ins.premium} for coverage of ₹${ins.coverage}`).join(', ');
      prompt += ` I also have insurance policies including ${insuranceDetails}.`;
    }

    if (interestRates.length > 0) {
      const interestRateSummary = interestRates.map(rate => `In ${rate.year}, the interest rates ranged between ${rate.return}.`).join(' ');
      prompt += ` Historical interest rates: ${interestRateSummary}`;
    }

    if (Object.keys(niftyReturns).length > 0) {
      const niftySummary = Object.entries(niftyReturns).map(([year, returnVal]) => `${year} saw a return of ${returnVal}`).join('. ');
      prompt += ` Historical NIFTY 50 returns: ${niftySummary}.`;
    }

    // Provide recommendations based on data
    if (loans.length > 0) {
      prompt += ` Given the existing loans, I recommend prioritizing repayment of these debts to reduce financial burden.`;
    }

    if (!emergencyFund || emergencyFund < (monthlyExpenditure * 6)) {
      prompt += ` It is advisable to build an emergency fund that covers at least 6 months of your monthly expenditure.`;
    }

    prompt += ` Based on this information, please evaluate my risk tolerance, calculate my net worth, and provide three tailored financial plans to help me achieve my financial goal.`;
    return prompt;
  };

  const generatePlan = async () => {
    setIsPlanLoading(true);
    setTimeoutError(false); // Reset timeout error

    const prompt = generatePrompt();

    const apiRequest = axios.post(`https://735a-34-44-160-84.ngrok-free.app/generate`, { prompt });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 300000) // 5-minute timeout
    );

    try {
      const response = await Promise.race([apiRequest, timeoutPromise]);
      setGeneratedText(response.data.generated_text);
    } catch (error) {
      console.error("Error generating text:", error);
      setGeneratedText("Sorry, the plan could not be generated at this time.");
      setTimeoutError(true);
    } finally {
      setIsPlanLoading(false);
    }
  };

  const handleGeneratePlanClick = () => {
    if (profile && assets && financialGoal) {
      generatePlan();
      console.log(prompt)
    } else {
      console.error("Data is not fully loaded yet");
    }
  };

  // Typewriter effect
  useEffect(() => {
    if (generatedText) {
      const intervalId = setInterval(() => {
        if (textIndex < generatedText.length) {
          setDisplayedText((prev) => prev + generatedText[textIndex]);
          setTextIndex((prev) => prev + 1);
        } else {
          clearInterval(intervalId);
        }
      }, 20); // Adjust typing speed here

      return () => clearInterval(intervalId);
    }
  }, [textIndex]);

  const handleOpenCalculator = () => setIsCalculatorOpen(!isCalculatorOpen);
  const deadlineYear = financialGoal?.deadline;
  const yearsRemaining = deadlineYear ? deadlineYear - currentYear : "";


  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#000000" }}>
      {loading ? (
        <Spin
          size="large"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        />
      ) : (
        <>
          <Header className="px-6 flex  justify-between">
            <div style={{ display: "flex", alignItems: "center" }}>
              <AntTitle className="font-bold "
                style={{ color: "#ffffff", margin: 0, fontSize: "24px" }}
              >
                FinAI
              </AntTitle>
            </div>
            <Space>
              <Button
                type="primary"
                icon={<FaCalculator />}
                size="large"
                onClick={handleOpenCalculator}
              >
                Calculator
              </Button>
            </Space>
          </Header>
          <Content style={{ padding: "24px", overflowY: "auto" }}>
            <AntTitle
              level={2}
              style={{
                textAlign: "center",
                color: "#ffffff",
                fontSize: "28px",
              }}
            >
              Hello, {profile.name || <Skeleton width={200} />}
            </AntTitle>

            {/* Financial Details Section */}
            <div className="mb-6">
              <h2 className="text-4xl font-bold mb-6 mt-8 text-2xl text-blue-500">
                Financial Details
              </h2>
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody>
                  <tr>
                      <td className="px-6 py-4 text-lg  text-gray-200">
                        <label className="font-bold"> Contact: </label>
                        {profile.email || <Skeleton width={150} />}
                      </td>
                      <td className="px-6 py-4 text-lg text-gray-200">
                        <label className="font-bold text-white">
                          Occupation:
                        </label>{" "}
                        {profile.occupation || <Skeleton width={100} />}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="py-2">
                        <hr className="border-gray-600" />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-lg  text-gray-200">
                        <label className="font-bold">Income: </label> ₹
                        {assets.monthlyIncome || <Skeleton width={100} />}
                      </td>
                      <td className="px-6 py-4 text-lg  text-gray-200">
                        <label className="font-bold">Expenditure:</label> ₹
                        {assets.monthlyExpenditure || <Skeleton width={100} />}
                      </td>
                      <td className="px-6 py-4 text-lg  text-gray-200">
                        <label className="font-bold">Emergency Fund: </label>₹
                        {assets.emergencyFund || <Skeleton width={100} />}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="py-2">
                        <hr className="border-gray-600" />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-lg  text-gray-200">
                        <label className="font-bold">Financial Goal:</label>{" "}
                        {financialGoal.goal || <Skeleton width={100} />}
                      </td>
                      <td className="px-6 py-4 text-lg text-gray-200">
                        <label className="font-bold">Target Amount:</label> ₹
                        {financialGoal.targetAmount || <Skeleton width={100} />}
                      </td>
                      <td className="px-6 py-4 text-lg  text-gray-200">
                        <label className="font-bold">TimeFrame:</label>{" "}
                        {yearsRemaining ? (
                          `${yearsRemaining} years`
                        ) : (
                          <Skeleton width={100} />
                        )}{" "}
                      </td>
                    </tr>
                    
                  </tbody>
                </table>
              </div>
            </div>

            {/* Generated Plan Section */}
            <AntTitle level={2} style={{ color: "#ffffff" }}>
              <label className="text-4xl font-bold mb-6 mt-8 text-2xl text-blue-500">Financial Plan</label>
            </AntTitle>
            <button
            className="bg-blue-500 text-white mb-5 text-sm font-bold py-4 px-6 rounded"

            onClick={handleGeneratePlanClick}>
              Generate
          </button>
            <Card className="bg-gray-800 border-gray-600">
              {isPlanLoading ? (
                <div class="w-9/12 mx-auto">
                  <div class="bg-gray-700 h-10 w-3/5 mb-2.5 rounded-md animate-pulse"></div>
                  <div class="bg-gray-700 h-10 w-4/5 mb-2.5 rounded-md animate-pulse"></div>
                  <div class="bg-gray-700 h-10 w-9/10 mb-2.5 rounded-md animate-pulse"></div>
                  <div class="bg-gray-700 h-10 w-7/10 mb-2.5 rounded-md animate-pulse"></div>
                  <div class="bg-gray-700 h-10 w-1/2 rounded-md animate-pulse"></div>
                </div>
              ) : (
                <Card style={{ backgroundColor: "black", color: "#ffffff" }}>
                  <Typography.Paragraph
                    style={{
                      whiteSpace: "pre-line",
                      fontSize: "16px",
                      color: "#ffffff",
                    }}
                  >
                    {displayedText}
                  </Typography.Paragraph>
                </Card>
              )}
            </Card>

            {/* Financial Calculator */}
            
          </Content>
          <Modal
  visible={isCalculatorOpen}
  onCancel={handleOpenCalculator}
  footer={null}
  bodyStyle={{
    padding: 0, // Remove padding
  }}
  width={400}
  style={{
    position: 'fixed',
    top: '10px',
    right: '10px',
    margin: 0,
    borderRadius: '8px',
  }}
  closeIcon={
    <span
      style={{
        backgroundColor: 'red',
        color: 'white',
        borderRadius: '50%',
        padding: '5px',
        fontSize: '16px',
        display: 'inline-block',
        lineHeight: '16px',
        textAlign: 'center',
      }}
    >
      </span> }
>
    <CompoundInterestCalculator />
</Modal>

        </>
      )}
    </Layout>
  );
};

export default Result;
