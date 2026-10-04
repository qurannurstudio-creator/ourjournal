import { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Modern Journal. Learn how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-red-600 selection:text-white flex flex-col">
      <main className="flex-grow max-w-4xl mx-auto px-4 py-20 w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-700">
          Privacy Policy
        </h1>
        <div className="prose prose-invert prose-lg max-w-none text-slate-300">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          
          <h2>1. Introduction</h2>
          <p>
            Welcome to Modern Journal ("we", "our", "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website (the "Site").
          </p>

          <h2>2. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
          <ul>
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number that you voluntarily give to us when you subscribe to our newsletter or leave comments.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
          </ul>

          <h2>3. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. We also use third-party services, such as Google Analytics and Google AdSense, which may use cookies to serve ads based on your prior visits to our website or other websites.
          </p>
          <p>
            Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet. Users may opt-out of personalized advertising by visiting Google Ads Settings.
          </p>

          <h2>4. Use of Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
          <ul>
            <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Site to you.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
            <li>Respond to product and customer service requests.</li>
          </ul>

          <h2>5. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:contact@modernjournal.info" className="text-red-400 hover:text-red-300">contact@modernjournal.info</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
