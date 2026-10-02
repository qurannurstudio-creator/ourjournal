import { notFound } from 'next/navigation';

export default function Home() {
  // Since the user does not want a main site, we can just return a 404
  // or a simple blank page.
  notFound();
}
