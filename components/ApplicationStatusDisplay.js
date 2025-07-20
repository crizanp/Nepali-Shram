import { useRouter } from 'next/router';

const ApplicationStatusDisplay = ({ applicationStatus, text }) => {
    const router = useRouter();

    return (
        <div className="bg-yellow-50 border border-yellow-200 sm:rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-medium text-yellow-800">{text.applicationSubmitted}</h3>
                    <p className="text-yellow-700 mt-1">{text.waitForApproval}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{text.applicationNumber}</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {applicationStatus.latestApplication?.applicationNumber}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600">{text.status}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            applicationStatus.latestApplication?.status === 'submitted'
                                ? 'bg-blue-100 text-blue-800'
                                : applicationStatus.latestApplication?.status === 'under_review'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : applicationStatus.latestApplication?.status === 'pending_documents'
                                        ? 'bg-orange-100 text-orange-800'
                                        : 'bg-red-100 text-red-800'
                        }`}>
                            {applicationStatus.latestApplication?.status?.replace('_', ' ').toUpperCase()}
                        </span>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600">{text.submittedOn}</p>
                    <p className="text-gray-900">
                        {new Date(applicationStatus.latestApplication?.submittedAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => router.push('/application')}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {text.viewApplication}
                </button>
                {applicationStatus.canEdit && (
                    <button
                        onClick={() => router.push(`/applications/${applicationStatus.latestApplication?.id}/edit`)}
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {text.editApplication}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ApplicationStatusDisplay;