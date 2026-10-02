import AutoRedirect from '@/components/AutoRedirect';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <AutoRedirect />
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
