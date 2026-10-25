import { Metadata } from 'next';
import LegalLayout from '@/components/LegalLayout';

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Algeria Times and our mission to deliver breaking news and exclusive stories.",
};

export default function AboutPage() {
  return (
    <LegalLayout title="About Us">
      <p>
        Welcome to <strong>Algeria Times</strong>, your premier source for breaking news, global affairs, in-depth analysis, and exclusive deep-dives into topics that matter.
      </p>
      <p>
        Our mission is simple: to uncover the truth and deliver stories that matter. In a world full of noise, we strive to cut through the clutter and bring you well-researched, engaging, and exclusive content that keeps you informed and ahead of the curve.
      </p>
      <h2>What We Cover</h2>
      <ul>
        <li><strong>Trending News:</strong> The stories everyone is talking about across the globe.</li>
        <li><strong>World Affairs & Economy:</strong> Financial and global developments shaping our future.</li>
        <li><strong>Technology & AI:</strong> The innovations transforming how we live and earn.</li>
        <li><strong>Culture & Society:</strong> Deep dives into modern living, psychology, and culture.</li>
      </ul>
      <h2>Our Commitment</h2>
      <p>
        We are committed to journalistic integrity and quality. Our team works diligently to curate exclusive stories and present them in a way that is accessible, engaging, and trustworthy.
      </p>
      <p>
        Thank you for being a part of the Algeria Times community. We invite you to read, share, and engage with our stories.
      </p>
    </LegalLayout>
  );
}