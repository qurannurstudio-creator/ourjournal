import { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service and conditions for using Modern Journal.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-red-600 selection:text-white flex flex-col">
      <main className="flex-grow max-w-4xl mx-auto px-4 py-20 w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-700">
          Terms of Service
        </h1>
        <div className="prose prose-invert prose-lg max-w-none text-slate-300">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

          <h2>1. Terms</h2>
          <p>
            By accessing the website at <a href="https://modernjournal.info" className="text-red-400 hover:text-red-300">modernjournal.info</a>, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on Modern Journal's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on Modern Journal's website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>

          <h2>3. Disclaimer</h2>
          <p>
            The materials on Modern Journal's website are provided on an 'as is' basis. Modern Journal makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2>4. Limitations</h2>
          <p>
            In no event shall Modern Journal or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Modern Journal's website, even if Modern Journal or a Modern Journal authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>

          <h2>5. Revisions and Errata</h2>
          <p>
            The materials appearing on Modern Journal's website could include technical, typographical, or photographic errors. Modern Journal does not warrant that any of the materials on its website are accurate, complete, or current. Modern Journal may make changes to the materials contained on its website at any time without notice.
          </p>

          <h2>6. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of the applicable jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
