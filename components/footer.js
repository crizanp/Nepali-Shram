import Image from "next/image";
import { useTranslation } from "../context/TranslationContext";

export default function Footer() {
    const { isNepali } = useTranslation();

    const footerLinks = isNepali
        ? [
            { name: 'गोपनीयता नीति', href: '#' },
            { name: 'प्रयोग कसरी गर्ने', href: '/tutorial' },
            { name: 'सम्झौता', href: '#' },
            { name: 'हाम्रो बारेमा', href: 'https://nepalishram.com/about' },
            { name: 'सम्पर्क गर्नुहोस्', href: 'https://nepalishram.com#contact' },
            { name: 'मुख्य साइट', href: 'https://nepalishram.com' }
        ]
        : [
            { name: 'Privacy Policy', href: '#' },
            { name: 'How to Use', href: '/tutorial' },
            { name: 'Agreement', href: '#' },
            { name: 'About Us', href: 'https://nepalishram.com/about' },
            { name: 'Contact', href: 'https://nepalishram.com#contact' },
            { name: 'Main Site', href: 'https://nepalishram.com' }
        ];

    return (
        <>
            <div className="bg-red-600 h-0.5"></div>
            <footer className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Logo Section */}
                        <div className="flex items-center">
                            <Image
                                src="https://portal.nepalishram.com/assets/Nepalishram.png"
                                alt="Nepali Shram Logo"
                                width={120}
                                height={40}
                            />
                        </div>

                        {/* Links Section */}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            {footerLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="px-3 py-1.5 text-xs text-gray-600 hover:text-white hover:bg-blue-900 border border-gray-300 hover:border-blue-600 rounded-md transition-all duration-200"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
