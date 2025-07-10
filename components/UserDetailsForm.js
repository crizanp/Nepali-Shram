import React from 'react';
import { User } from 'lucide-react';

const UserDetailsForm = ({ formData, errors, onInputChange, userEmail }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center mb-6">
                <User className="w-6 h-6 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={onInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={onInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your email address"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={onInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your phone number"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                        WhatsApp Number
                    </label>
                    <input
                        type="tel"
                        name="whatsappNumber"
                        value={formData.whatsappNumber || ''}
                        onChange={onInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900"
                        placeholder="Enter WhatsApp number"
                    />
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-2">
                        Passport Number *
                    </label>
                    <input
                        type="text"
                        name="passportNumber"
                        value={formData.passportNumber}
                        onChange={onInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-lg text-gray-900 ${errors.passportNumber ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your passport number"
                    />
                    {errors.passportNumber && <p className="text-red-500 text-sm mt-1">{errors.passportNumber}</p>}
                </div>
            </div>
        </div>
    );
};

export default UserDetailsForm;