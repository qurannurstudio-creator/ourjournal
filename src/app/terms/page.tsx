import { Metadata } from 'next';
import LegalLayout from '@/components/LegalLayout';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the Algeria Times website.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>

      <h2>1. Terms</h2>
      <p>
        By accessing this Website, accessible from {SITE_URL}, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.
      </p>

      <h2>2. Use License</h2>
      <p>
        Permission is granted to temporarily download one copy of the materials on Algeria Times's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
      </p>
      <ul>
        <li>modify or copy the materials;</li>
        <li>use the materials for any commercial purpose or for any public display;</li>
        <li>attempt to reverse engineer any software contained on Algeria Times's Website;</li>
        <li>remove any copyright or other proprietary notations from the materials; or</li>
        <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
      </ul>

      <h2>3. Disclaimer</h2>
      <p>
        The materials on Algeria Times's website are provided on an 'as is' basis. Algeria Times makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
      </p>

      <h2>4. Limitations</h2>
      <p>
        In no event shall Algeria Times or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Algeria Times's website, even if Algeria Times or an Algeria Times authorized representative has been notified orally or in writing of the possibility of such damage.
      </p>

      <h2>5. Revisions and Errata</h2>
      <p>
        The materials appearing on Algeria Times's website could include technical, typographical, or photographic errors. Algeria Times does not warrant that any of the materials on its website are accurate, complete, or current. Algeria Times may make changes to the materials contained on its website at any time without notice.
      </p>

      <h2>6. Governing Law</h2>
      <p>
        These terms and conditions are governed by and construed in accordance with the laws of the applicable jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
      </p>
    </LegalLayout>
  );
}