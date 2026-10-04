import { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "General disclaimer for the content published on Modern Journal.",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-red-600 selection:text-white flex flex-col">
      <main className="flex-grow max-w-4xl mx-auto px-4 py-20 w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-700">
          Disclaimer
        </h1>
        <div className="prose prose-invert prose-lg max-w-none text-slate-300">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

          <h2>General Information</h2>
          <p>
            The information provided by Modern Journal ("we," "us," or "our") on <a href="https://modernjournal.info" className="text-red-400 hover:text-red-300">modernjournal.info</a> (the "Site") is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
          </p>

          <h2>External Links Disclaimer</h2>
          <p>
            The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability or completeness by us.
          </p>
          <p>
            We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site or any website or feature linked in any banner or other advertising.
          </p>

          <h2>Professional Disclaimer</h2>
          <p>
            The Site cannot and does not contain legal, financial, or medical advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.
          </p>

          <h2>Fair Use Notice</h2>
          <p>
            This website may contain copyrighted material, the use of which has not always been specifically authorized by the copyright owner. We are making such material available for the purpose of criticism, comment, news reporting, teaching, scholarship, or research.
          </p>

          <p>
            If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at <a href="mailto:contact@modernjournal.info" className="text-red-400 hover:text-red-300">contact@modernjournal.info</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
