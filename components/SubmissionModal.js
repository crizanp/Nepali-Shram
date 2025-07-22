// components/SubmissionModal.js
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function SubmissionModal({ 
  isOpen, 
  onClose, 
  type, // 'success' or 'error'
  title, 
  message,
  applicationNumber = null,
  isNepali = false
}) {
  if (!isOpen) return null;

  const whatsappText = isNepali 
    ? 'समस्या भएको छ। कृपया nepalishram आधिकारिक WhatsApp मार्फत सम्पर्क गर्नुहोस्'
    : 'Something went wrong. Please directly contact via nepalishram official WhatsApp';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            {type === 'success' ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <AlertCircle className="h-6 w-6 text-red-500" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {message && <p className="text-gray-700 mb-4">{message}</p>}
          
          {applicationNumber && applicationNumber !== 'N/A' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-green-800">
                {isNepali ? 'आवेदन नम्बर:' : 'Application Number:'}
              </p>
              <p className="text-lg font-bold text-green-900 mt-1">
                {applicationNumber}
              </p>
            </div>
          )}

          {applicationNumber === 'N/A' && type === 'success' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-700">
                {isNepali 
                  ? 'आवेदन नम्बर अहिले उपलब्ध छैन। तपाईंको आवेदन सफलतापूर्वक पेश गरिएको छ।'
                  : 'Application number not available at the moment. Your application has been submitted successfully.'
                }
              </p>
            </div>
          )}

          {type === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-700">
                {whatsappText}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              type === 'success'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isNepali ? 'बन्द गर्नुहोस्' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}