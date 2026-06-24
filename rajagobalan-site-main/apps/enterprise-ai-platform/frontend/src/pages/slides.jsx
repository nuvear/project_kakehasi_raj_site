import React, { useState } from 'react';
import Layout from '../components/Layout';
import SlidePreview from '../components/slides/SlidePreview';
import { exportSlides } from '../utils/api';
import { DEMO_COMPANY_ID, SLIDE_SECTIONS } from '../utils/constants';

export default function SlidesPage() {
  const [companyName, setCompanyName] = useState('Acme Corp');
  const [deckTitle, setDeckTitle] = useState('AI Transformation Strategy');
  const [selectedSections, setSelectedSections] = useState([
    'Executive Summary',
    'Maturity Assessment',
    'Roadmap',
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(null);

  const handleToggleSection = (section) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleSelectAll = () => {
    setSelectedSections(SLIDE_SECTIONS);
  };

  const handleClearAll = () => {
    setSelectedSections([]);
  };

  const handleExportSlides = async (e) => {
    e.preventDefault();
    if (selectedSections.length === 0) {
      setError('Please select at least one section');
      return;
    }

    setLoading(true);
    setError(null);
    setDownloadProgress('Generating presentation...');

    try {
      const blob = await exportSlides(DEMO_COMPANY_ID, {
        company_name: companyName,
        deck_title: deckTitle,
        sections: selectedSections,
      });

      setDownloadProgress('Downloading file...');

      // Trigger browser download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AI_Strategy_Deck.pptx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadProgress(null);
    } catch (err) {
      setError(err.message || 'Failed to export slides');
      setDownloadProgress(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Slide Generator">
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Strategy Deck Generator
            </h1>
            <p className="text-gray-600 text-lg">
              Create a professional PowerPoint presentation for your AI transformation strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Configuration Form - Left Column */}
            <div className="lg:col-span-1">
              <form onSubmit={handleExportSlides} className="bg-white rounded-lg shadow-md p-8 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Configuration
                </h2>

                {/* Company Name */}
                <div className="mb-6">
                  <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    id="company-name"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your company name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Deck Title */}
                <div className="mb-6">
                  <label htmlFor="deck-title" className="block text-sm font-medium text-gray-700 mb-2">
                    Deck Title
                  </label>
                  <input
                    id="deck-title"
                    type="text"
                    value={deckTitle}
                    onChange={(e) => setDeckTitle(e.target.value)}
                    placeholder="Presentation title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Sections Selection */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Include Sections
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={handleClearAll}
                        className="text-xs text-gray-600 hover:text-gray-700 font-medium"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {SLIDE_SECTIONS.map((section) => (
                      <label
                        key={section}
                        className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSections.includes(section)}
                          onChange={() => handleToggleSection(section)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          {section}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Section Count */}
                <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">{selectedSections.length}</span> slide{selectedSections.length !== 1 ? 's' : ''} selected
                  </p>
                </div>

                {/* Export Button */}
                <button
                  type="submit"
                  disabled={loading || selectedSections.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Exporting...
                    </span>
                  ) : (
                    '📥 Export as PowerPoint'
                  )}
                </button>

                {/* Download Progress */}
                {downloadProgress && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">{downloadProgress}</p>
                  </div>
                )}
              </form>
            </div>

            {/* Preview Section - Right Column */}
            <div className="lg:col-span-2">
              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-medium text-sm">Error</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              )}

              {/* Preview Header */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Slide Preview
                </h2>
                <p className="text-gray-600 text-sm">
                  See a preview of the slides that will be included in your presentation
                </p>
              </div>

              {/* Preview Cards */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <SlidePreview sections={selectedSections} />
              </div>

              {/* Info Section */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">
                  💡 About Your Presentation
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>
                    ✓ Customized with your company name: <span className="font-semibold">{companyName}</span>
                  </li>
                  <li>
                    ✓ Titled: <span className="font-semibold">{deckTitle}</span>
                  </li>
                  <li>
                    ✓ Professional design and formatting
                  </li>
                  <li>
                    ✓ Ready to present or edit further in PowerPoint
                  </li>
                  <li>
                    ✓ All content is specific to your organization's AI strategy
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
