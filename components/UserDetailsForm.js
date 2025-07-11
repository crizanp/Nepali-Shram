import React from 'react';
import { User } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';

const UserDetailsForm = ({ formData, errors, onInputChange, userEmail }) => {
    const { isNepali } = useTranslation();

    // Translation object
    const text = {
        title: isNepali ? 'व्यक्तिगत जानकारी' : 'Personal Information',
        fullName: isNepali ? 'पूरा नाम' : 'Full Name',
        fullNamePlaceholder: isNepali ? 'आफ्नो पूरा नाम लेख्नुहोस्' : 'Enter your full name',
        email: isNepali ? 'इमेल ठेगाना' : 'Email Address',
        emailPlaceholder: isNepali ? 'आफ्नो इमेल ठेगाना लेख्नुहोस्' : 'Enter your email address',
        phone: isNepali ? 'फोन नम्बर' : 'Phone Number',
        phonePlaceholder: isNepali ? 'आफ्नो फोन नम्बर लेख्नुहोस्' : 'Enter your phone number',
        whatsapp: isNepali ? 'व्हाट्सएप नम्बर' : 'WhatsApp Number',
        whatsappPlaceholder: isNepali ? 'व्हाट्सएप नम्बर लेख्नुहोस्' : 'Enter WhatsApp number',
        passport: isNepali ? 'पासपोर्ट नम्बर' : 'Passport Number',
        passportPlaceholder: isNepali ? 'आफ्नो पासपोर्ट नम्बर लेख्नुहोस्' : 'Enter your passport number',
        required: isNepali ? ' *' : ' *'
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center mb-6">
                <User className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">{text.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                        {text.fullName}{text.required}
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={onInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder={text.fullNamePlaceholder}
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                        {text.email}{text.required}
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={onInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder={text.emailPlaceholder}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                        {text.phone}{text.required}
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={onInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder={text.phonePlaceholder}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                        {text.whatsapp}
                    </label>
                    <input
                        type="tel"
                        name="whatsappNumber"
                        value={formData.whatsappNumber || ''}
                        onChange={onInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900"
                        placeholder={text.whatsappPlaceholder}
                    />
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                        {text.passport}{text.required}
                    </label>
                    <input
                        type="text"
                        name="passportNumber"
                        value={formData.passportNumber}
                        onChange={onInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.passportNumber ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder={text.passportPlaceholder}
                    />
                    {errors.passportNumber && <p className="text-red-500 text-sm mt-1">{errors.passportNumber}</p>}
                </div>
            </div>
        </div>
    );
};

export default UserDetailsForm;