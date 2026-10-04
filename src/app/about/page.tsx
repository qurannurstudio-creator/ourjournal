import { Metadata } from 'next';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Modern Journal and our mission to deliver exclusive trending stories.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-red-600 selection:text-white flex flex-col">
      <main className="flex-grow max-w-4xl mx-auto px-4 py-20 w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-700">
          About Us
        </h1>
        <div className="prose prose-invert prose-lg max-w-none text-slate-300">
          <p>
            Welcome to <strong>Modern Journal</strong>, your premium source for the latest viral stories, in-depth analysis, and exclusive deep-dives into trending topics across the globe.
          </p>
          <p>
            Our mission is simple: to uncover the truth and deliver stories that matter. In a world full of noise, we strive to cut through the clutter and bring you well-researched, engaging, and exclusive content that keeps you informed and ahead of the curve.
          </p>
          <h2>What We Cover</h2>
          <ul>
            <li><strong>Trending News:</strong> The viral stories everyone is talking about.</li>
            <li><strong>World Affairs:</strong> Global events shaping our future.</li>
            <li><strong>Technology:</strong> The innovations transforming how we live and work.</li>
            <li><strong>Lifestyle:</strong> Deep dives into modern living, psychology, and culture.</li>
          </ul>
          <h2>Our Commitment</h2>
          <p>
            We are committed to journalistic integrity and quality. Our team works around the clock to source exclusive stories and present them in a way that is accessible, engaging, and trustworthy.
          </p>
          <p>
            Thank you for being a part of the Modern Journal community. We invite you to read, share, and engage with our stories.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
