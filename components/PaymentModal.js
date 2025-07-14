import React, { useState } from 'react';
import { X, CreditCard, Copy, Check } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';

const PaymentModal = ({ isOpen, onClose }) => {
    const [selectedAge, setSelectedAge] = useState('');
    const [copiedField, setCopiedField] = useState(null);
    const { isNepali } = useTranslation();

    const text = {
        title: isNepali ? 'भुक्तानी विवरण' : 'Payment Details',
        ageQuestion: isNepali ? 'तपाईंको सही कानुनी उमेर कति हो?' : 'What is your accurate legal age?',
        ageRange1: isNepali ? '18-35 वर्ष' : '18-35 years',
        ageRange2: isNepali ? '36-50 वर्ष' : '36-50 years',
        ageRange3: isNepali ? '51-64 वर्ष' : '51-64 years',
        selectAge: isNepali ? 'कृपया आफ्नो उमेर समूह छान्नुहोस्' : 'Please select your age group',
        bankAccount: isNepali ? 'बैंक खाता' : 'Bank Account',
        accountNumber: isNepali ? 'खाता नम्बर' : 'Account Number',
        accountName: isNepali ? 'खाता नाम' : 'Account Name',
        bankName: isNepali ? 'बैंक नाम' : 'Bank Name',
        amount: isNepali ? 'रकम' : 'Amount',
        reference: isNepali ? 'सन्दर्भ' : 'Reference',
        scanQR: isNepali ? 'QR कोड स्क्यान गर्नुहोस्' : 'Scan QR Code',
        esewa: isNepali ? 'ई-सेवा' : 'eSewa',
        khalti: isNepali ? 'खल्ती' : 'Khalti',
        copy: isNepali ? 'कपी गर्नुहोस्' : 'Copy',
        copied: isNepali ? 'कपी भयो' : 'Copied',
        close: isNepali ? 'बन्द गर्नुहोस्' : 'Close',
        afterPayment: isNepali ? 'भुक्तानी पछि, कृपया रसिद अपलोड गर्नुहोस्' : 'After payment, please upload the receipt',
        note: isNepali ? 'टिप्पणी' : 'Note'
    };

    const ageGroups = [
        { id: '18-35', label: text.ageRange1, price: 8016 },
        { id: '36-50', label: text.ageRange2, price: 9244 },
        { id: '51-64', label: text.ageRange3, price: 13776 }
    ];

    const getPaymentInfo = (price) => ({
        bank: {
            accountNumber: "4987040648752402",
            accountName: "Foxbeep Pvt. Ltd.",
            bankName: "NIC Asia Bank",
            amount: `Rs. ${price.toLocaleString()}`,
            reference: "APP-2024-001"
        },
        esewa: {
            id: "9813478383",
            amount: `Rs. ${price.toLocaleString()}`,
            reference: "APP-2024-001",
        },
        khalti: {
            id: "9813478383",
            amount: `Rs. ${price.toLocaleString()}`,
            reference: "APP-2024-001",
        }
    });

    const handleCopy = async (text, field) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleAgeSelect = (ageGroup) => {
        setSelectedAge(ageGroup);
    };

    const selectedAgeGroup = ageGroups.find(group => group.id === selectedAge);
    const paymentInfo = selectedAgeGroup ? getPaymentInfo(selectedAgeGroup.price) : null;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                <div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            {text.title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 p-1"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    {/* Age Selection */}
                    <div className="mb-6 sm:mb-8">
                        <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">{text.ageQuestion}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {ageGroups.map((group) => (
                                <button
                                    key={group.id}
                                    onClick={() => handleAgeSelect(group.id)}
                                    className={`p-3 sm:p-4 cursor-pointer rounded-lg border-2 transition-all ${
                                        selectedAge === group.id
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className="font-medium text-sm sm:text-base">{group.label}</div>
                                        <div className="text-base sm:text-lg font-bold text-green-600 mt-1">
                                            Rs. {group.price.toLocaleString()}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Payment Details */}
                    {selectedAgeGroup && paymentInfo ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                           

                            {/* eSewa */}
                            <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm sm:text-base">
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-600 rounded mr-2"></div>
                                    {text.esewa}
                                </h4>
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                                        <span className="text-xs sm:text-sm text-gray-600">ID:</span>
                                        <div className="flex items-center">
                                            <span className="font-mono text-xs sm:text-sm">{paymentInfo.esewa.id}</span>
                                            <button
                                                onClick={() => handleCopy(paymentInfo.esewa.id, 'esewa-id')}
                                                className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
                                            >
                                                {copiedField === 'esewa-id' ? <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                                        <span className="text-xs sm:text-sm text-gray-600">{text.amount}:</span>
                                        <span className="text-xs sm:text-sm font-bold text-green-600">{paymentInfo.esewa.amount}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                                        <span className="text-xs sm:text-sm text-gray-600">{text.reference}:</span>
                                        <div className="flex items-center">
                                            <span className="font-mono text-xs sm:text-sm">{paymentInfo.esewa.reference}</span>
                                            <button
                                                onClick={() => handleCopy(paymentInfo.esewa.reference, 'esewa-ref')}
                                                className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
                                            >
                                                {copiedField === 'esewa-ref' ? <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-center mt-3 sm:mt-4">
                                        <p className="text-xs sm:text-sm text-gray-600 mb-2">{text.scanQR}</p>
                                        <img
                                            src='/assets/esewa-qr.png'
                                            alt="eSewa QR Code"
                                            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto border rounded object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="text-center py-6 sm:py-8">
                            <p className="text-gray-500 text-sm sm:text-base">{text.selectAge}</p>
                        </div>
                    )}

                    {selectedAgeGroup && (
                        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-xs sm:text-sm text-yellow-800">
                                <strong>{text.note}:</strong> {text.afterPayment}
                            </p>
                        </div>
                    )}

                    <div className="mt-4 sm:mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base"
                        >
                            {text.close}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;