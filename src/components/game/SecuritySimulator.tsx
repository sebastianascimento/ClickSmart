'use client';

import { useState, useEffect } from 'react';

interface SecuritySimulatorProps {
  onComplete: (score: number) => void;
}

interface Choice {
  id: string;
  text: string;
  isGood: boolean;
  consequence: string;
  lesson: string;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  choices: Choice[];
}

const SecuritySimulator: React.FC<SecuritySimulatorProps> = ({ onComplete }) => {
  const [score, setScore] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [showConsequence, setShowConsequence] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const scenarios: Scenario[] = [
    {
      id: 'phishing',
      title: 'Suspicious Website',
      description: "You receive an email that appears to be from your bank, asking you to update your account information. The link leads to a site that looks like your bank's site, but the URL is 'my-secure-bank.com' instead of the official 'mybank.com'.",
      choices: [
        {
          id: 'fill',
          text: 'Fill in your details as requested',
          isGood: false,
          consequence: 'Your login credentials were captured by cybercriminals. They accessed your account and transferred money to their account.',
          lesson: 'Always check the URL of websites where you enter sensitive information. Look for https:// and the padlock icon, and carefully verify the domain name.'
        },
        {
          id: 'check',
          text: 'Check the URL and security certificate',
          isGood: true,
          consequence: "You noticed that the URL is not official and the site doesn't have the secure padlock icon. You avoided a phishing attempt.",
          lesson: 'Great job! Checking the URL and security certificate is a crucial step before entering sensitive information online.'
        },
        {
          id: 'close',
          text: 'Close the site immediately',
          isGood: true,
          consequence: 'You avoided entering any data on the suspicious site. This protected you from the phishing attempt.',
          lesson: "Good instinct! When in doubt about a site's legitimacy, it's safer to close it and contact the company directly through official channels."
        }
      ]
    },
    {
      id: 'password',
      title: 'Creating a Password',
      description: "You're creating a new account for an important service and need to set a password. What kind of password would you choose?",
      choices: [
        {
          id: 'simple',
          text: 'A simple, easy-to-remember password like "123456" or "password"',
          isGood: false,
          consequence: 'Your simple password was cracked in seconds by an automated program. Your account was compromised.',
          lesson: 'Simple passwords are incredibly vulnerable to brute force attacks. Even adding a few unusual characters makes a password exponentially more secure.'
        },
        {
          id: 'strong',
          text: 'A complex password with letters, numbers, and symbols like "K7%j9@Lp2$xR"',
          isGood: true,
          consequence: 'Your complex password would take thousands of years to crack with current technology, keeping your account secure.',
          lesson: 'Strong passwords that mix character types are much more secure. Consider using a password manager to create and store complex passwords.'
        },
        {
          id: 'reuse',
          text: 'Reuse a password you already use for other accounts',
          isGood: false,
          consequence: 'One of your other accounts was breached, and hackers tried the same password on multiple services. They gained access to all accounts with the same password.',
          lesson: 'Using unique passwords for each account is essential. If one service is breached, your other accounts remain protected.'
        }
      ]
    },
    {
      id: 'publicWifi',
      title: 'Public Wi-Fi',
      description: "You're at a coffee shop and need to check your bank account balance. The coffee shop offers free, open Wi-Fi with no password.",
      choices: [
        {
          id: 'useVPN',
          text: 'Connect using a VPN before accessing your bank account',
          isGood: true,
          consequence: 'Your connection was encrypted through the VPN, protecting your data from potential snoopers on the public network.',
          lesson: 'Using a VPN creates an encrypted tunnel for your data, making public Wi-Fi much safer for sensitive transactions.'
        },
        {
          id: 'login',
          text: 'Connect directly to the Wi-Fi and log into your bank',
          isGood: false,
          consequence: 'Someone on the same network was using packet-sniffing software and captured your login credentials when you entered them.',
          lesson: 'Public Wi-Fi networks are often unencrypted, making it possible for others to intercept data you send or receive.'
        },
        {
          id: 'wait',
          text: 'Wait until you get home to use your secure network',
          isGood: true,
          consequence: 'You avoided connecting to your sensitive accounts on an insecure network, protecting your data.',
          lesson: 'For highly sensitive actions like banking, using a trusted network is always the safest option.'
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChoiceSelect = (choiceId: string) => {
    const currentScenarioData = scenarios[currentScenario];
    const choice = currentScenarioData.choices.find(c => c.id === choiceId);
    
    if (choice) {
      setSelectedChoice(choiceId);
      // Add points if it's a good choice
      if (choice.isGood) {
        setScore(prevScore => prevScore + 10);
      }
      
      // Show consequence
      setShowConsequence(true);
    }
  };

  const handleNextScenario = () => {
    setShowConsequence(false);
    setSelectedChoice(null);
    
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prevScenario => prevScenario + 1);
    } else {
      // Game completed
      onComplete(score);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-900">Starting Simulation...</h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const currentScenarioData = scenarios[currentScenario];
  const selectedChoiceData = selectedChoice 
    ? currentScenarioData.choices.find(c => c.id === selectedChoice) 
    : null;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Security Simulation: What If...</h2>
          <div className="text-xl text-gray-900">Score: {score}</div>
        </div>
        
        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Scenario {currentScenario + 1}/{scenarios.length}: {currentScenarioData.title}</h3>
          <p className="text-gray-700">{currentScenarioData.description}</p>
        </div>
        
        {!showConsequence ? (
          <div>
            <h4 className="text-lg font-medium mb-4 text-gray-900">What would you do?</h4>
            <div className="space-y-3">
              {currentScenarioData.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoiceSelect(choice.id)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-left p-4 rounded-lg transition text-gray-900 font-medium"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 p-5 rounded-lg">
            <div className={`text-lg font-semibold mb-3 ${selectedChoiceData?.isGood ? 'text-green-600' : 'text-red-600'}`}>
              {selectedChoiceData?.isGood ? 'Good security choice!' : 'Security risk detected!'}
            </div>
            
            <div className="mb-4">
              <h5 className="font-medium mb-2 text-gray-900">Consequence:</h5>
              <p className="text-gray-700">{selectedChoiceData?.consequence}</p>
            </div>
            
            <div className="mb-6">
              <h5 className="font-medium mb-2 text-gray-900">Security lesson:</h5>
              <p className="text-gray-700">{selectedChoiceData?.lesson}</p>
            </div>
            
            <button 
              onClick={handleNextScenario} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              {currentScenario < scenarios.length - 1 ? 'Next scenario' : 'Finish simulation'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySimulator;