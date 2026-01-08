import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section with Cattle Background */}
      <div className="relative h-[500px] rounded-3xl overflow-hidden mb-8 shadow-2xl">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&q=80)',
            filter: 'brightness(0.6)'
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/80 to-transparent" />
        
        {/* Content */}
        <div className="relative h-full flex flex-col justify-center px-12">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Cattle Disease Detection
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Early disease detection thanks welfare livestock using cattle imagery
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="bg-success-500 hover:bg-success-600 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Upload Image
            </button>
          </div>
        </div>

        {/* Decorative Cattle Silhouette */}
        <div className="absolute right-12 bottom-0 opacity-30 hidden lg:block">
          <svg className="w-80 h-80" viewBox="0 0 200 200" fill="white">
            <ellipse cx="100" cy="140" rx="70" ry="55"/>
            <circle cx="100" cy="75" r="45"/>
            <circle cx="85" cy="70" r="6" fill="#1e293b"/>
            <circle cx="115" cy="70" r="6" fill="#1e293b"/>
            <path d="M 70 60 Q 65 50 60 55" stroke="white" strokeWidth="3" fill="none"/>
            <path d="M 130 60 Q 135 50 140 55" stroke="white" strokeWidth="3" fill="none"/>
          </svg>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-gray-500 text-sm">
              User ID: <span className="font-mono text-primary-600">{user?.user_id}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Scans</p>
              <p className="text-4xl font-bold">0</p>
              <p className="text-blue-100 text-xs mt-2">All time uploads</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-success-500 to-success-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Healthy</p>
              <p className="text-4xl font-bold">0</p>
              <p className="text-green-100 text-xs mt-2">Healthy cattle detected</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-danger-500 to-danger-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium mb-1">Diseased</p>
              <p className="text-4xl font-bold">0</p>
              <p className="text-red-100 text-xs mt-2">Diseases detected</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => navigate('/upload')}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group border border-gray-100 hover:border-primary-300"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-md">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Upload Image</h3>
          <p className="text-gray-600 text-sm">Upload cattle images for instant AI-powered disease detection</p>
        </div>

        <div 
          onClick={() => navigate('/reports')}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group border border-gray-100 hover:border-success-300"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-md">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">My Reports</h3>
          <p className="text-gray-600 text-sm">View and download your previous detection reports</p>
        </div>

        <div 
          onClick={() => navigate('/reports')}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group border border-gray-100 hover:border-purple-300"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-md">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Health Tracking</h3>
          <p className="text-gray-600 text-sm">Monitor cattle health trends over time</p>
        </div>

        <div 
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group border border-gray-100 hover:border-orange-300"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-md">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Prevention Tips</h3>
          <p className="text-gray-600 text-sm">Learn about disease prevention and best practices</p>
        </div>
      </div>
    </Layout>
  );
}
