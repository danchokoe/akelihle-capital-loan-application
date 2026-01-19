import React from 'react';

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "How much can I borrow from Akelihle Capital?",
      answer: "We offer short-term loans ranging from R500 to R5,000, depending on your affordability assessment."
    },
    {
      question: "What documents are required for an application?",
      answer: "To process your application, we require a clear copy of your South African ID, proof of residence (not older than 3 months), and your latest salary slip."
    },
    {
      question: "How long does the approval process take?",
      answer: "Once all documents are submitted and verified, approval typically takes between 1 to 24 hours. Once approved, funds are disbursed immediately."
    },
    {
      question: "What is the interest rate on my loan?",
      answer: "We charge a competitive fixed interest rate of 20% on all our short-term loans, plus an initiation fee based on the loan term."
    },
    {
      question: "Can I repay my loan early?",
      answer: "Yes, you have the right to settle your loan agreement at any time. Early settlement may reduce the total cost of credit as interest is calculated up to the date of settlement."
    },
    {
      question: "What happens if I cannot make a payment?",
      answer: "If you are experiencing financial difficulty, please contact us immediately on WhatsApp or Email. Defaulting on payments may negatively affect your credit score and incur additional collection costs."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-bold text-yellow-400 mb-8 uppercase tracking-tight text-center">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 shadow-sm">
            <h3 className="text-lg font-bold text-yellow-400 mb-2">{faq.question}</h3>
            <p className="text-neutral-300 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;