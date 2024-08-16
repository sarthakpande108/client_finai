import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Result = () => {
  const [profile, setProfile] = useState({});
  const [assets, setAssets] = useState({});
  const [financialGoal, setFinancialGoal] = useState({});
  const [prompt, setPrompt] = useState(''); // State to store the generated prompt
  

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
        const loanDetails = loans.map(loan => `${loan.type} of ₹${loan.amount} INR at an interest rate of ${loan.interest}%, with a monthly installment of ₹${loan.installamount} INR started in year ${loan.startDate}till ${loan.expiryDate}`).join(', ');
        prompt += ` Additionally, I have loans including ${loanDetails}.`;
    }

    prompt += ` Please consider the following expected returns: a stock return of 15%, a SIP mutual fund return of 10%, and an interest rate of 9%. Based on this information, kindly assess my risk tolerance, calculate my net worth, and provide a tailored financial plan to help me achieve my financial goal.`;

    console.log(prompt);
};

  

  useEffect(() => {
    if (profile && assets && financialGoal) {
      generatePrompt();
    }
  }, [profile, assets, financialGoal]);

  return (
    <div>
      <h2>Generated Prompt</h2>
      {<h1>{prompt}</h1>}
    </div>
  );
};

export default Result;
