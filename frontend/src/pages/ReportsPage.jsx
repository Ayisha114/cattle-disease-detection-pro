import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import axios from 'axios';
import { FileText, Download, Eye, Calendar, CheckCircle, XCircle } from 'lucide-react';

export default function ReportsPage() {
  const { token } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'healthy', 'diseased'

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('/api/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data.reports);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    if (filter === 'healthy') return report.status === 'Healthy';
    if (filter === 'diseased') return report.status === 'Diseased';
    return true;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Reports</h1>
          
          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('healthy')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'healthy'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Healthy
            </button>
            <button
              onClick={() => setFilter('diseased')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'diseased'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Diseased
            </button>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No reports found</p>
            <p className="text-gray-500 mt-2">Upload an image to generate your first report</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredReports.map((report) => (
              <div key={report.report_id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Status Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      report.status === 'Healthy' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {report.status === 'Healthy' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>

                    {/* Report Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-800">Report {report.report_id}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          report.status === 'Healthy'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {report.status}
                        </span>
                        {report.status === 'Diseased' && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                            {report.disease_name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(report.timestamp).toLocaleDateString()}
                        </span>
                        <span>Confidence: {report.confidence}%</span>
                        {report.stage && report.stage !== 'N/A' && (
                          <span>Stage: {report.stage}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
