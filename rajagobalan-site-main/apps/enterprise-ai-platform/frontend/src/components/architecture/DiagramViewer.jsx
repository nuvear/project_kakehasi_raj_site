export default function DiagramViewer({ svgString, components }) {
  const getBadgeColor = (buildOrBuy) => {
    if (buildOrBuy === 'build') {
      return 'bg-blue-100 text-blue-800 border border-blue-300';
    } else if (buildOrBuy === 'buy') {
      return 'bg-green-100 text-green-800 border border-green-300';
    } else if (buildOrBuy === 'partner') {
      return 'bg-amber-100 text-amber-800 border border-amber-300';
    }
    return 'bg-gray-100 text-gray-800 border border-gray-300';
  };

  const getBadgeLabel = (buildOrBuy) => {
    return buildOrBuy ? buildOrBuy.charAt(0).toUpperCase() + buildOrBuy.slice(1) : 'Unknown';
  };

  return (
    <div className="space-y-8">
      {/* SVG Diagram Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Architecture Diagram</h2>
        <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto border border-gray-200">
          {svgString ? (
            <div dangerouslySetInnerHTML={{ __html: svgString }} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No diagram available
            </div>
          )}
        </div>
      </div>

      {/* Components List Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Architecture Components</h2>

        {components && Array.isArray(components) && components.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {components.map((component, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{component.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{component.type || 'Component'}</p>
                  </div>
                </div>

                {component.description && (
                  <p className="text-sm text-gray-700 mb-3">{component.description}</p>
                )}

                <div className="flex flex-wrap gap-2 items-center">
                  {component.build_or_buy && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(component.build_or_buy)}`}>
                      {getBadgeLabel(component.build_or_buy)}
                    </span>
                  )}

                  {component.category && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                      {component.category}
                    </span>
                  )}
                </div>

                {component.notes && (
                  <p className="text-xs text-gray-600 mt-3 italic">{component.notes}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-gray-500">
            No components available
          </div>
        )}
      </div>
    </div>
  );
}
