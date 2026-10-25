import { Metadata } from 'next';
import LegalLayout from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Algeria Times team.",
};

export default function ContactPage() {
  return (
    <LegalLayout title="Contact Us">
      <p>
        We love hearing from our readers! Whether you have a news tip, a question about our articles, or a business inquiry, feel free to reach out to us. Our team is always ready to connect with you.
      </p>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mt-8 shadow-inner">
        <h2 className="text-2xl font-bold mb-6 text-white !mt-0">Get in Touch</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-2">General Inquiries</h3>
            <p className="text-slate-300 !my-1">
              For general questions, feedback, or support, please email us at:<br/>
              <a href="mailto:contact@algeriatimes.info" className="text-lg font-medium text-white hover:text-emerald-400 transition-colors no-underline">
                contact@algeriatimes.info
              </a>
            </p>
          </div>

          <div className="h-px bg-slate-800 w-full"></div>

          <div>
            <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-2">News Tips & Exclusives</h3>
            <p className="text-slate-300 !my-1">
              Have a breaking story or an exclusive leak? Send it to our editorial team securely at:<br/>
              <a href="mailto:tips@algeriatimes.info" className="text-lg font-medium text-white hover:text-emerald-400 transition-colors no-underline">
                tips@algeriatimes.info
              </a>
            </p>
          </div>

          <div className="h-px bg-slate-800 w-full"></div>

          <div>
            <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-2">Business & Advertising</h3>
            <p className="text-slate-300 !my-1">
              For partnerships, sponsored content, or advertising opportunities, reach out to:<br/>
              <a href="mailto:business@algeriatimes.info" className="text-lg font-medium text-white hover:text-emerald-400 transition-colors no-underline">
                business@algeriatimes.info
              </a>
            </p>
          </div>
        </div>
      </div>
    </LegalLayout>
  );
}