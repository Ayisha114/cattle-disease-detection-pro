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
import { Users, FileText, TrendingUp, Activity, Download } from 'lucide-react';

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
  const [statusFilter, setStatusFilter] = useState('all');
  const [diseaseFilter, setDiseaseFilter] = useState('all');

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
        backgroundColor: ['rgba(34, 197, 94, 0.7)', 'rgba(239, 68, 68, 0.7)'],
        borderColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)'],
        borderWidth: 2,
        borderRadius: 8
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
          'rgba(239, 68, 68, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(168, 85, 247, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(236, 72, 153, 0.7)'
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(249, 115, 22)',
          'rgb(234, 179, 8)',
          'rgb(168, 85, 247)',
          'rgb(59, 130, 246)',
          'rgb(236, 72, 153)'
        ],
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        ticks: {
          font: {
            size: 12
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor system statistics and user activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Users</p>
                <p className="text-4xl font-bold">{stats?.totalUsers || 0}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Users className="w-7 h-7" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Total Reports</p>
                <p className="text-4xl font-bold">{stats?.totalReports || 0}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FileText className="w-7 h-7" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-success-500 to-success-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Healthy</p>
                <p className="text-4xl font-bold">{stats?.healthyCount || 0}</p>
                <p className="text-green-100 text-xs mt-1">
                  {stats?.totalReports ? ((stats.healthyCount / stats.totalReports) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Activity className="w-7 h-7" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-danger-500 to-danger-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm mb-1">Diseased</p>
                <p className="text-4xl font-bold">{stats?.diseasedCount || 0}</p>
                <p className="text-red-100 text-xs mt-1">
                  {stats?.totalReports ? ((stats.diseasedCount / stats.totalReports) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="w-7 h-7" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Analytics Overview</h2>
            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              PDF Report
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Healthy vs Diseased Chart */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Healthy vs Diseased</h3>
                <div className="flex gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success-500 rounded"></div>
                    <span className="text-gray-600">Healthy: {stats?.healthyCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-danger-500 rounded"></div>
                    <span className="text-gray-600">Diseased: {stats?.diseasedCount || 0}</span>
                  </div>
                </div>
              </div>
              <div className="h-72 bg-gray-50 rounded-xl p-4">
                <Bar data={healthStatusData} options={chartOptions} />
              </div>
            </div>

            {/* Disease Category Distribution */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Disease Category</h3>
                <select
                  value={diseaseFilter}
                  onChange={(e) => setDiseaseFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Diseases</option>
                  {stats?.diseaseDistribution?.map(d => (
                    <option key={d._id} value={d._id}>{d._id}</option>
                  ))}
                </select>
              </div>
              <div className="h-72 bg-gray-50 rounded-xl p-4">
                <Bar data={diseaseDistData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-primary-700 text-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Reports</h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-primary-600 border border-primary-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="all">All Status</option>
              <option value="healthy">Healthy</option>
              <option value="diseased">Diseased</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Report ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">User</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Disease</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Confidence</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats?.recentReports
                  ?.filter(report => {
                    if (statusFilter === 'all') return true;
                    return report.status.toLowerCase() === statusFilter;
                  })
                  .map((report) => (
                    <tr key={report.report_id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm text-gray-800">{report.report_id}</span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">{report.user_name}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          report.status === 'Healthy'
                            ? 'bg-success-100 text-success-700'
                            : 'bg-danger-100 text-danger-700'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">{report.disease_name || '-'}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[80px]">
                            <div
                              className={`h-2 rounded-full ${
                                report.confidence >= 80 ? 'bg-success-500' : 
                                report.confidence >= 50 ? 'bg-warning-500' : 'bg-danger-500'
                              }`}
                              style={{ width: `${report.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{report.confidence}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(report.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
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
