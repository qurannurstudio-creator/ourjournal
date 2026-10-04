import { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Modern Journal team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-red-600 selection:text-white flex flex-col">
      <main className="flex-grow max-w-4xl mx-auto px-4 py-20 w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-700">
          Contact Us
        </h1>
        
        <div className="prose prose-invert prose-lg max-w-none text-slate-300 mb-12">
          <p>
            We love hearing from our readers! Whether you have a news tip, a question about our articles, or a business inquiry, feel free to reach out to us. Our team is always ready to connect with you.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-red-900/10 max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 text-white">Get in Touch</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-2">General Inquiries</h3>
              <p className="text-slate-300">
                For general questions, feedback, or support, please email us at:<br/>
                <a href="mailto:contact@modernjournal.info" className="text-lg font-medium text-white hover:text-red-400 transition-colors">
                  contact@modernjournal.info
                </a>
              </p>
            </div>

            <div className="h-px bg-slate-800 w-full"></div>

            <div>
              <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-2">News Tips & Exclusives</h3>
              <p className="text-slate-300">
                Have a breaking story or an exclusive leak? Send it to our editorial team securely at:<br/>
                <a href="mailto:tips@modernjournal.info" className="text-lg font-medium text-white hover:text-red-400 transition-colors">
                  tips@modernjournal.info
                </a>
              </p>
            </div>
            
            <div className="h-px bg-slate-800 w-full"></div>

            <div>
              <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-2">Business & Advertising</h3>
              <p className="text-slate-300">
                For partnerships, sponsored content, or advertising opportunities, reach out to:<br/>
                <a href="mailto:business@modernjournal.info" className="text-lg font-medium text-white hover:text-red-400 transition-colors">
                  business@modernjournal.info
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
