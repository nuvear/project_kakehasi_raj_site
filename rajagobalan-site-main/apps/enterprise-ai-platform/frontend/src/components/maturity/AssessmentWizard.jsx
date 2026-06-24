'use client';

import React, { useState } from 'react';
import { MATURITY_DOMAINS } from '../../utils/constants';

const ASSESSMENT_QUESTIONS = {
  'Strategy & Governance': [
    {
      id: 'sg1',
      question: 'How clearly defined is your AI strategy aligned with business objectives?',
    },
    {
      id: 'sg2',
      question:
        'To what extent do you have established governance frameworks for AI projects?',
    },
    {
      id: 'sg3',
      question: 'How regularly do you review and update your AI strategy?',
    },
    {
      id: 'sg4',
      question:
        'Do you have executive sponsorship and commitment to AI transformation?',
    },
    {
      id: 'sg5',
      question: 'How well-defined are the roles and responsibilities for AI initiatives?',
    },
    {
      id: 'sg6',
      question: 'What is your level of stakeholder alignment on AI priorities?',
    },
  ],
  'Data & Analytics': [
    {
      id: 'da1',
      question: 'How mature is your data collection and quality management process?',
    },
    {
      id: 'da2',
      question: 'Do you have a centralized data platform or data warehouse?',
    },
    {
      id: 'da3',
      question: 'How effective are your data governance and privacy controls?',
    },
    {
      id: 'da4',
      question:
        'What is your capability to perform advanced analytics and predictive modeling?',
    },
    {
      id: 'da5',
      question: 'How accessible is data to decision-makers across the organization?',
    },
    {
      id: 'da6',
      question: 'Do you have established KPIs for measuring analytics impact?',
    },
  ],
  'Technology Infrastructure': [
    {
      id: 'ti1',
      question: 'How scalable is your current cloud infrastructure for AI workloads?',
    },
    {
      id: 'ti2',
      question: 'Do you have ML/AI platforms or tools in place for development?',
    },
    {
      id: 'ti3',
      question: 'How mature is your model deployment and monitoring capability?',
    },
    {
      id: 'ti4',
      question: 'What is your level of API and microservices architecture adoption?',
    },
    {
      id: 'ti5',
      question: 'How well-integrated are your systems with AI/ML pipelines?',
    },
    {
      id: 'ti6',
      question:
        'Do you have automated testing and continuous integration for AI models?',
    },
  ],
  'Talent & Skills': [
    {
      id: 'ts1',
      question: 'How many trained data scientists and ML engineers do you have?',
    },
    {
      id: 'ts2',
      question:
        'What is your capability to hire and retain AI talent in the market?',
    },
    {
      id: 'ts3',
      question: 'How extensive is your AI training and upskilling program?',
    },
    {
      id: 'ts4',
      question: 'Do you have a culture that encourages AI experimentation?',
    },
    {
      id: 'ts5',
      question:
        'How well do business teams understand AI capabilities and limitations?',
    },
    {
      id: 'ts6',
      question: 'Are you able to attract top AI talent from the market?',
    },
  ],
  'Process & Operations': [
    {
      id: 'po1',
      question: 'How standardized are your AI project development processes?',
    },
    {
      id: 'po2',
      question: 'Do you have defined workflows for model experimentation and validation?',
    },
    {
      id: 'po3',
      question: 'How effective is your change management for AI implementation?',
    },
    {
      id: 'po4',
      question:
        'What is your capability to manage AI model lifecycle and versioning?',
    },
    {
      id: 'po5',
      question: 'How robust are your processes for ethical AI and bias detection?',
    },
    {
      id: 'po6',
      question:
        'Do you have defined SLAs and performance metrics for AI models in production?',
    },
  ],
  'Culture & Change Management': [
    {
      id: 'ccm1',
      question: 'How open is your organization to AI-driven change?',
    },
    {
      id: 'ccm2',
      question:
        'Do you have clear communication about AI benefits and potential disruptions?',
    },
    {
      id: 'ccm3',
      question:
        'How well do employees understand their role in the AI transformation?',
    },
    {
      id: 'ccm4',
      question:
        'What is the level of psychological safety for proposing AI innovations?',
    },
    {
      id: 'ccm5',
      question: 'How effectively do you manage resistance to AI adoption?',
    },
    {
      id: 'ccm6',
      question: 'Do you have success stories and celebration of AI wins?',
    },
  ],
};

export default function AssessmentWizard({ onSubmit, loading }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentDomain = MATURITY_DOMAINS[currentStep];
  const questions = ASSESSMENT_QUESTIONS[currentDomain] || [];

  const handleAnswer = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const handleNext = () => {
    if (currentStep < MATURITY_DOMAINS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  const isCurrentStepComplete = questions.every((q) => answers[q.id] !== undefined);
  const progress = Math.round(
    ((Object.keys(answers).length) / (MATURITY_DOMAINS.length * 6)) * 100
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep + 1} of {MATURITY_DOMAINS.length}
          </span>
          <span className="text-sm font-medium text-gray-700">{progress}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Domain Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentDomain}</h2>
        <p className="text-gray-600">
          Answer the following questions to assess your maturity in this domain.
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-6 mb-8">
        {questions.map((question) => (
          <div key={question.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-900 font-medium mb-4">{question.question}</p>

            {/* Radio Button Options */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((rating) => (
                <label key={rating} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={question.id}
                    value={rating}
                    checked={answers[question.id] === rating}
                    onChange={() => handleAnswer(question.id, rating)}
                    className="w-4 h-4 text-blue-600 cursor-pointer"
                  />
                  <span className="ml-3 text-gray-700">
                    {rating === 1 && 'Not Established (1)'}
                    {rating === 2 && 'Initial (2)'}
                    {rating === 3 && 'Developing (3)'}
                    {rating === 4 && 'Mature (4)'}
                    {rating === 5 && 'Advanced (5)'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center gap-4">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Back
        </button>

        <div className="flex gap-2">
          {MATURITY_DOMAINS.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {currentStep < MATURITY_DOMAINS.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={!isCurrentStepComplete}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading || !isCurrentStepComplete}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Submitting...' : 'Submit Assessment'}
          </button>
        )}
      </div>
    </div>
  );
}
