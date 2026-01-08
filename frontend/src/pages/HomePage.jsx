import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Upload, FileText, TrendingUp, Shield } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: 'Upload Image',
      description: 'Upload cattle images for instant AI-powered disease detection',
      color: 'bg-blue-500',
      action: () => navigate('/upload')
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'My Reports',
      description: 'View and download your previous detection reports',
      color: 'bg-green-500',
      action: () => navigate('/reports')
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Health Tracking',
      description: 'Monitor cattle health trends over time',
      color: 'bg-purple-500',
      action: () => navigate('/reports')
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Prevention Tips',
      description: 'Learn about disease prevention and best practices',
      color: 'bg-orange-500',
      action: () => {}
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative px-8 py-16 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Cattle Disease Detection
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Early disease detection thanks welfare livestock using cattle imagery
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="bg-success-500 hover:bg-success-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg"
            >
              Upload Image
            </button>
          </div>
          
          {/* Decorative Cattle Image */}
          <div className="absolute right-0 bottom-0 opacity-20 hidden md:block">
            <svg className="w-64 h-64" viewBox="0 0 200 200" fill="white">
              <circle cx="100" cy="80" r="40"/>
              <ellipse cx="100" cy="140" rx="60" ry="50"/>
              <circle cx="85" cy="75" r="5" fill="black"/>
              <circle cx="115" cy="75" r="5" fill="black"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="card mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-600">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-gray-600">
              User ID: {user?.user_id}
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {features.map((feature, index) => (
          <div
            key={index}
            onClick={feature.action}
            className="card hover:shadow-xl transition-shadow cursor-pointer group"
          >
            <div className={`${feature.color} w-16 h-16 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium mb-1">Total Scans</p>
              <p className="text-3xl font-bold text-blue-700">0</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium mb-1">Healthy</p>
              <p className="text-3xl font-bold text-green-700">0</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium mb-1">Diseased</p>
              <p className="text-3xl font-bold text-red-700">0</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
