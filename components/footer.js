import Image from "next/image";

export default function Footer() {
    const footerLinks = [
        { name: 'Privacy Policy', href: '#' },
        { name: 'How to Use', href: '#' },
        { name: 'Agreement', href: '#' },
        { name: 'About Us', href: '#' },
        { name: 'Contact', href: '#' },
        { name: 'Main Site', href: '#' }
    ];

    return (
        <>
            <div className="bg-red-600 h-0.5"></div>
            <footer className="bg-white border-t border-gray-200 ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                    <div className="flex justify-between items-center">
                        {/* Logo Section */}
                        <div className="flex items-center">
                            <div className="text-xl font-bold text-gray-800">
                                <Image src="/NepaliShram.png" alt="Nepali Shram Logo" width={120} height={40} />
                            </div>
                        </div>

                        {/* Links Section */}
                        <div className="flex flex-wrap items-center gap-2">
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