import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Result = () => {
  const [profile, setProfile] = useState({});
  const [assets, setAssets] = useState({});
  const [financialGoal, setFinancialGoal] = useState({});
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    const fetchProfile = async () => {
      try {
        const profileResponse = await axios.get(`https://finaiserver-production.up.railway.app/api/profiles/${userId}`);
        setProfile(profileResponse.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    const fetchAssets = async () => {
      try {
        const assetsResponse = await axios.get(`https://finaiserver-production.up.railway.app/api/assets/${userId}`);
        setAssets(assetsResponse.data);
      } catch (error) {
        console.error('Error fetching assets data:', error);
      }
    };

    const fetchFinancialGoal = async () => {
      try {
        const goalResponse = await axios.get(`https://finaiserver-production.up.railway.app/api/financialgoals/${userId}`);
        setFinancialGoal(goalResponse.data);
      } catch (error) {
        console.error('Error fetching financial goal data:', error);
      }
    };

    fetchProfile();
    fetchAssets();
    fetchFinancialGoal();
  }, []);

  const generatePrompt = () => {
    const {
      name, age, occupation, maritalStatus, dependents = [],
    } = profile;

    const {
      monthlyIncome, monthlyExpenditure, currentSavings,
      emergencyFund, investments = [], insurance = [], loans = [],
    } = assets;

    const { goal, targetAmount, deadline } = financialGoal;

    let prompt = `My name is ${name}, and I am ${age} years old, currently engaged in ${occupation}. I am ${maritalStatus}.`;

    if (dependents.length > 0) {
      const dependentsDetails = dependents.map(dep => `${dep.relationship} ${dep.name} with age of ${dep.age}`).join(', ');
      prompt += ` I have dependents: ${dependentsDetails}.`;
    }

    prompt += ` I have set a financial goal to ${goal} by the year ${deadline}, with a target amount of ₹${targetAmount} INR. My monthly income is ₹${monthlyIncome} INR, and my monthly expenditure amounts to ₹${monthlyExpenditure} INR. I have accumulated current savings of ₹${currentSavings} INR and an emergency fund of ₹${emergencyFund} INR.`;

    if (investments.length > 0) {
      const investmentDetails = investments.map(inv => `${inv.type} valued at ₹${inv.amount} INR`).join(', ');
      prompt += ` In terms of investments, I hold ${investmentDetails}.`;
    }

    if (insurance.length > 0) {
      const insuranceDetails = insurance.map(ins => `${ins.type} policy with ${ins.provider}, paying a premium of ₹${ins.premium} INR, providing coverage of ₹${ins.coverage} INR`).join(', ');
      prompt += ` I also have insurance policies including ${insuranceDetails}.`;
    }

    if (loans.length > 0) {
      const loanDetails = loans.map(loan => `${loan.type} of ₹${loan.amount} INR at an interest rate of ${loan.interest}%, with a monthly installment of ₹${loan.installamount} INR started in year ${loan.startDate} till ${loan.expiryDate}`).join(', ');
      prompt += ` Additionally, I have loans including ${loanDetails}.`;
    }

    prompt += ` Please consider the following expected returns: a stock return of 15%, a SIP mutual fund return of 10%, and an interest rate of 9%. Based on this information, kindly assess my risk tolerance, calculate my net worth, and provide a tailored financial plan to help me achieve my financial goal.`;

    return prompt;
  };

  const handleGenerate = async () => {
    const prompt ='my name is abc ,my age is 60,currenly working as mechanical engineer with salary of 75000, i am married and i have 2son and 1daughter with age of 23 and 25 respectively.also have have my mom and papa with me their age is 70 and 75 respectively,my financial goal is to save 5000000 for my retirement. my montly expenditure is 30thousand (excluding loans,sip etc).and my current saving is 500000, i have emergency fund of 500000, i have a debt of 2500000  of home lone with a annual intrest rate of 6.7 percent for a time frame of 15years in that i have already completed my 10 years by paying installment of 20000 per month. i also have life insurace of 50000 per year premium which i buyed from Life insurance corporations, i  have also invested my money i have invested nealry 200000 in stocks such as  reliance,Bharat dynamics and bpcl ,also i pay SIP of 4000 per month and was paying from past 5 years and have 500000 in my fixed deposit. so now consider the stock return  of past 3years to be(10,15,12) percent and sip mutual fund return of 3years to be (12,14,9) percent and intrest rate of past 3 years (7,9,8.5) percent give me plan such that i can acheive my goal in my timeframe, by calculating my risk based on my investments and dependents give me 3 plans. plans should be such that if I have  loan then plan should first focus on debt reduction,then check if insurace is there if not then suggest and then give plan with remeaining money, so that he can acheive his goal.plan should include mutual funds,recurring deposts,fixed deposits,bonds and stocks.based on this give me 3 plans'
    setLoading(true);
    try {
      const response = await axios.post('https://8fc0-34-171-234-32.ngrok-free.app/generate', { prompt });
      setGeneratedText(response.data.generated_text);
    } catch (error) {
      console.error('Error generating text:', error);
    }
    setLoading(false);
  };

  return (
    <div className='bg-black'>
      <h2>Generated Text</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>{generatedText}</div>
      )}
      <button onClick={handleGenerate}>Generate</button>
    </div>
  );
};

export default Result;
