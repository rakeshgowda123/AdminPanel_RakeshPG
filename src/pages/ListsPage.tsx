import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import {
  FileUp,
  DownloadCloud,
  FileSpreadsheet,
  Info,
  Clock,
  User,
  AlertTriangle,
  X,
} from "lucide-react";
import Loader from "../components/Loader";
import { useDropzone } from "react-dropzone";

interface Agent {
  _id: string;
  name: string;
  totalAssigned: number;
}

interface Batch {
  _id: string;
  count: number;
  date: string;
}

const ListsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListsData();
  }, []);

  const fetchListsData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/lists");
      setBatches(data.batches);
      setAgents(data.distributionSummary);
    } catch (error) {
      toast.error("Failed to fetch lists data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    // Check file type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a CSV, XLS, or XLSX file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await api.post("/api/lists/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("List uploaded and distributed successfully");
      fetchListsData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload file");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileChange,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="w-[90%] ml-auto px-9 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Lists Management</h1>
          <p className="text-[hsl(var(--muted-foreground))]">
            Upload and distribute lists to your agents
          </p>
        </div>

        <button
          className="btn btn-primary sm:self-start flex-shrink-0"
          onClick={() => setIsInfoModalOpen(true)}
        >
          <Info size={18} className="mr-1" />
          Upload Guidelines
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* File Upload Card */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Upload New List</h2>
            </div>
            <div className="card-body">
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors
                  ${
                    isDragActive
                      ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))/5]"
                      : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))/5]"
                  }
                `}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center">
                  {uploading ? (
                    <>
                      <div className="w-12 h-12 mb-4 text-[hsl(var(--primary))]">
                        <div className="w-12 h-12 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-lg font-medium mb-2">
                        Uploading file...
                      </p>
                      <p className="text-[hsl(var(--muted-foreground))]">
                        Processing and distributing items to agents
                      </p>
                    </>
                  ) : (
                    <>
                      <DownloadCloud
                        size={48}
                        className="text-[hsl(var(--primary))] mb-4"
                      />
                      <p className="text-lg font-medium mb-2">
                        {isDragActive
                          ? "Drop the file here..."
                          : "Drag & drop a file, or click to browse"}
                      </p>
                      <p className="text-[hsl(var(--muted-foreground))]">
                        Supported formats: CSV, XLS, XLSX
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="card-footer bg-[hsl(var(--muted))]">
              <div className="flex items-center">
                <AlertTriangle
                  size={18}
                  className="text-[hsl(var(--warning))] mr-2 flex-shrink-0"
                />
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Files must contain columns: FirstName, Phone, and Notes. Items
                  will be distributed automatically among all agents.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Uploads */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold">Recent Uploads</h2>
            </div>
            {loading ? (
              <div className="p-8">
                <Loader />
              </div>
            ) : batches.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[hsl(var(--muted))]">
                      <th className="px-4 py-3 text-left text-sm font-medium text-[hsl(var(--foreground))]">
                        Batch
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[hsl(var(--foreground))]">
                        Items
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-[hsl(var(--foreground))]">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[hsl(var(--border))]">
                    {batches.map((batch) => (
                      <tr
                        key={batch._id}
                        className="hover:bg-[hsl(var(--muted))]"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileSpreadsheet
                              size={16}
                              className="text-[hsl(var(--primary))] mr-2"
                            />
                            <span className="text-sm font-medium">
                              {batch._id.slice(-8)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm">
                            {batch.count} {batch.count === 1 ? "item" : "items"}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center text-sm text-[hsl(var(--muted-foreground))]">
                            <Clock size={16} className="mr-1" />{" "}
                            {formatDate(batch.date)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-8 text-[hsl(var(--muted-foreground))]">
                <FileSpreadsheet
                  size={48}
                  className="mx-auto mb-4 text-[hsl(var(--muted-foreground))]"
                />
                <p>No upload batches found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Agents Summary */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h2 className="text-lg font-semibold">Agents Summary</h2>
              <button
                onClick={() => navigate("/agents")}
                className="btn btn-outline btn-sm"
              >
                See all
              </button>
            </div>
            <div className="card-body space-y-4">
              {loading ? (
                <Loader />
              ) : agents.length === 0 ? (
                <p className="text-[hsl(var(--muted-foreground))] text-center">
                  No agents found.
                </p>
              ) : (
                agents.map((agent) => {
                  const totalAssigned = agent.totalAssigned || 0;
                  const done = agent.totalAssigned ? agent.totalAssigned : 0;
                  // If you have a done count different from totalAssigned, update here accordingly
                  const progressPercent = totalAssigned
                    ? Math.round((done / totalAssigned) * 100)
                    : 0;

                  return (
                    <div
                      key={agent._id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/agents/${agent._id}`)}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{agent.name}</h3>
                        <span className="text-sm text-[hsl(var(--muted-foreground))]">
                          {progressPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-[hsl(var(--muted))] rounded-full h-3 mt-1 overflow-hidden">
                        <div
                          className="h-3 bg-[hsl(var(--primary))]"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Guidelines Modal */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              onClick={() => setIsInfoModalOpen(false)}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Upload Guidelines</h2>
            <p className="mb-2">
              Please ensure your uploaded file is in CSV, XLS, or XLSX format.
            </p>
            <p className="mb-2">
              The file must contain the following columns (case-sensitive):
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>
                <strong>FirstName</strong> - The agent's first name
              </li>
              <li>
                <strong>Phone</strong> - Contact number
              </li>
              <li>
                <strong>Notes</strong> - Any additional notes
              </li>
            </ul>
            <p>
              Items in the file will be automatically distributed among all
              agents.
            </p>
            <div className="mt-6 text-right">
              <button
                className="btn btn-primary"
                onClick={() => setIsInfoModalOpen(false)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListsPage;
