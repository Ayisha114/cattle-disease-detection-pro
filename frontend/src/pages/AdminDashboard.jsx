import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Users, FileText, TrendingUp, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  // Healthy vs Diseased Chart
  const healthStatusData = {
    labels: ['Healthy', 'Diseased'],
    datasets: [
      {
        label: 'Count',
        data: [stats?.healthyCount || 0, stats?.diseasedCount || 0],
        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)'],
        borderWidth: 2
      }
    ]
  };

  // Disease Category Distribution
  const diseaseDistData = {
    labels: stats?.diseaseDistribution?.map(d => d._id) || [],
    datasets: [
      {
        label: 'Cases',
        data: stats?.diseaseDistribution?.map(d => d.count) || [],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(249, 115, 22)',
          'rgb(234, 179, 8)',
          'rgb(168, 85, 247)'
        ],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">Total Users</p>
                <p className="text-3xl font-bold text-blue-700">{stats?.totalUsers || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium mb-1">Total Reports</p>
                <p className="text-3xl font-bold text-purple-700">{stats?.totalReports || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium mb-1">Healthy</p>
                <p className="text-3xl font-bold text-green-700">{stats?.healthyCount || 0}</p>
                <p className="text-xs text-green-600 mt-1">
                  {stats?.totalReports ? ((stats.healthyCount / stats.totalReports) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium mb-1">Diseased</p>
                <p className="text-3xl font-bold text-red-700">{stats?.diseasedCount || 0}</p>
                <p className="text-xs text-red-600 mt-1">
                  {stats?.totalReports ? ((stats.diseasedCount / stats.totalReports) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Healthy vs Diseased Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Healthy vs Diseased</h3>
            <div className="h-64">
              <Bar data={healthStatusData} options={chartOptions} />
            </div>
          </div>

          {/* Disease Category Distribution */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Disease Category Distribution</h3>
            <div className="h-64">
              <Bar data={diseaseDistData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Reports</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Report ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Disease</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Confidence</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentReports?.map((report) => (
                  <tr key={report.report_id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{report.report_id}</td>
                    <td className="py-3 px-4 text-sm">{report.user_name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'Healthy'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{report.disease_name}</td>
                    <td className="py-3 px-4 text-sm">{report.confidence}%</td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(report.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
