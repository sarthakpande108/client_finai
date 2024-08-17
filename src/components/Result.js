import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Result = () => {
  const [profile, setProfile] = useState({});
  const [assets, setAssets] = useState({});
  const [financialGoal, setFinancialGoal] = useState({});
  const [generatedText, setGeneratedText] = useState('');

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

  useEffect(() => {
    if (profile && assets && financialGoal) {
      const prompt ="my name is abc ,my age is 75,currenly working as mechanical engineer with salary of 75000, i am married and i have 2son and 1daughter with age of 23 and 25 respectively.also have have my mom and papa with me their age is 70 and 75 respectively,my financial goal is to go to foreing tour with my family in time frame of  5 years the target amount is 20 lakh.my montly expenditure is 25thousand .and my current saving is 0, i have emergency fund of 5lakh, i have a debt of 1 crore  of home lone with a annual intrest rate of 6.7 percent for a time frame of 20years in that i have already completed my 5 years by paying installment of 20000 per month. i also have life insurace of 50000 per year premium, i  have also invested my money i have invested nealry 2 lakhs in stocks such as  reliance,Bharat dynamics and bpcl ,also i pay SIP of 4000 per month and was paying from past 5 years and have  no fd. so now consider the stock return to 25 percent and sip mutual fund return to 15 percent and intrest rate of 9 percent give me plan.you calculate my risk tollerance,my net worth and give me a plan"

      // Send prompt to backend for text generation
      axios.post('https://667f-35-240-164-212.ngrok-free.app/generate', { prompt })
        .then(response => {
          setGeneratedText(response.data.generated_text);
        })
        .catch(error => {
          console.error('Error generating text:', error);
        });
    }
  }, [profile, assets, financialGoal]);
  console.log(generatePrompt)

  return (
    <div className='bg-black'>
      <h2>Generated Text</h2>
      {generatedText && <p>{generatedText}</p>}
      <h1>{prompt}</h1>
    </div>
  );
};

export default Result;
