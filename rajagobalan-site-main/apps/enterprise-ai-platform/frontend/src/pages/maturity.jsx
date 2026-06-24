import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { submitMaturityAssessment, getMaturityResults } from '../utils/api';
import { DEMO_COMPANY_ID, DOMAIN_COLORS } from '../utils/constants';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Questions Configuration
const ASSESSMENT_QUESTIONS = [
  // Strategy
  { id: 'strat_1', domain: 'strategy', text: 'Does the organization have a clearly defined AI strategy aligned with business goals?' },
  { id: 'strat_2', domain: 'strategy', text: 'Is there executive sponsorship and budget allocated for AI initiatives?' },
  { id: 'strat_3', domain: 'strategy', text: 'Are AI use cases prioritized based on business value and feasibility?' },
  
  // Infrastructure
  { id: 'infra_1', domain: 'infrastructure', text: 'Is there a scalable cloud infrastructure for AI training and inference?' },
  { id: 'infra_2', domain: 'infrastructure', text: 'Are MLOps practices (CI/CD for ML) implemented?' },
  { id: 'infra_3', domain: 'infrastructure', text: 'Do you have access to necessary compute resources (GPUs)?' },

  // Data
  { id: 'data_1', domain: 'data', text: 'Is data centralized, accessible, and of high quality?' },
  { id: 'data_2', domain: 'data', text: 'Are there automated data pipelines?' },
  { id: 'data_3', domain: 'data', text: 'Is data governance and security strictly enforced?' },

  // People
  { id: 'ppl_1', domain: 'people', text: 'Do you have an in-house team of Data Scientists and ML Engineers?' },
  { id: 'ppl_2', domain: 'people', text: 'Is there an AI literacy program for the wider organization?' },
  { id: 'ppl_3', domain: 'people', text: 'Is there a culture of experimentation and data-driven decision making?' },

  // Governance
  { id: 'gov_1', domain: 'governance', text: 'Is there an AI ethics board or framework in place?' },
  { id: 'gov_2', domain: 'governance', text: 'Are model risks (bias, drift, security) actively managed?' },
  { id: 'gov_3', domain: 'governance', text: 'Is there compliance with relevant AI regulations?' },
];

const DOMAIN_LABELS = {
  strategy: 'Strategy',
  infrastructure: 'Infrastructure',
  data: 'Data',
  people: 'People',
  governance: 'Governance'
};

export default function MaturityAssessment() {
  const [activeTab, setActiveTab] = useState('assessment'); // 'assessment' or 'results'
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize answers with defaults (3)
  useEffect(() => {
    const initialAnswers = {};
    ASSESSMENT_QUESTIONS.forEach(q => {
      initialAnswers[q.id] = 3;
    });
    setAnswers(initialAnswers);
    
    // Check if there's an existing result
    fetchExistingResults();
  }, []);

  const fetchExistingResults = async () => {
    try {
      const data = await getMaturityResults(DEMO_COMPANY_ID);
      if (data) {
        setResults(data);
        setActiveTab('results');
      }
    } catch (err) {
      // Ignore 404, just means no assessment yet
      console.log('No existing assessment found');
    }
  };

  const handleScoreChange = (questionId, score) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: parseInt(score)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        company_id: DEMO_COMPANY_ID,
        answers: ASSESSMENT_QUESTIONS.map(q => ({
          question_id: q.id,
          domain: q.domain,
          score: answers[q.id]
        }))
      };

      const response = await submitMaturityAssessment(payload);
      setResults(response);
      setActiveTab('results');
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.message || 'Failed to submit assessment');
    } finally {
      setLoading(false);
    }
  };

  const retakeAssessment = () => {
    setActiveTab('assessment');
    window.scrollTo(0, 0);
  };

  // Group questions by domain for the form
  const questionsByDomain = ASSESSMENT_QUESTIONS.reduce((acc, q) => {
    if (!acc[q.domain]) acc[q.domain] = [];
    acc[q.domain].push(q);
    return acc;
  }, {});

  // Chart Data
  const chartData = results ? {
    labels: Object.values(DOMAIN_LABELS),
    datasets: [
      {
        label: 'Maturity Score',
        data: [
          results.strategy_score,
          results.infrastructure_score,
          results.data_score,
          results.people_score,
          results.governance_score
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3b82f6',
      },
    ],
  } : null;

  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Maturity Assessment</h1>
        <p className="text-gray-600 mt-2">Evaluate your organization's AI readiness across 5 key dimensions.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-4 px-6 font-medium text-sm transition-colors ${
            activeTab === 'assessment'
              ? 'border-b-2 border-sky-600 text-sky-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('assessment')}
        >
          Assessment
        </button>
        <button
          className={`py-4 px-6 font-medium text-sm transition-colors ${
            activeTab === 'results'
              ? 'border-b-2 border-sky-600 text-sky-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('results')}
          disabled={!results}
        >
          Results
        </button>
      </div>

      {activeTab === 'assessment' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          {Object.entries(questionsByDomain).map(([domain, questions]) => (
            <div key={domain} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 capitalize border-b pb-2">
                {DOMAIN_LABELS[domain]}
              </h2>
              <div className="space-y-6">
                {questions.map((q) => (
                  <div key={q.id}>
                    <p className="text-gray-800 font-medium mb-3">{q.text}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500 w-12">Low</span>
                      <div className="flex-1 flex justify-between gap-2">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            onClick={() => handleScoreChange(q.id, val)}
                            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                              answers[q.id] === val
                                ? 'bg-sky-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 w-12 text-right">High</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center"><i className="fas fa-circle-notch fa-spin mr-2"></i> Analyzing...</span>
              ) : (
                'Submit Assessment'
              )}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'results' && results && (
        <div className="space-y-8 animate-fade-in">
          {/* Top Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Maturity Level</h2>
                <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">
                  {results.maturity_level.replace('_', ' ').toUpperCase()}
                </div>
                <p className="text-gray-600 mt-2 text-lg">Overall Score: <span className="font-bold text-gray-900">{results.overall_score.toFixed(1)}/5.0</span></p>
              </div>
              <div className="w-full max-w-sm h-64">
                <Radar data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <i className="fas fa-bullseye text-red-500 mr-3"></i>
                Priority Areas
              </h3>
              <div className="space-y-4">
                {results.recommendations?.priority_areas?.map(([domain, score], idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                    <span className="font-medium text-gray-800 capitalize">{domain}</span>
                    <span className="bg-white px-3 py-1 rounded font-bold text-red-600 shadow-sm">{score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <i className="fas fa-check-circle text-emerald-500 mr-3"></i>
                Recommendations
              </h3>
              <ul className="space-y-3">
                {results.recommendations?.recommendations?.map((rec, idx) => (
                  <li key={idx} className="flex items-start text-gray-700">
                    <i className="fas fa-angle-right text-sky-500 mt-1 mr-3"></i>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-center pt-8">
            <button
              onClick={retakeAssessment}
              className="text-gray-500 hover:text-sky-600 font-medium transition-colors"
            >
              <i className="fas fa-redo mr-2"></i> Retake Assessment
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
