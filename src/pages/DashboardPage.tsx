import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Users, FileSpreadsheet, FileCheck } from "lucide-react";
import Loader from "../components/Loader";

interface DashboardStats {
  totalAgents: number;
  totalLists: number;
  totalItems: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalAgents: 0,
    totalLists: 0,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [agentsRes, listsRes] = await Promise.all([
          api.get("/api/agents"),
          api.get("/api/lists"),
        ]);

        setStats({
          totalAgents: agentsRes.data.length,
          totalLists: listsRes.data.batches.length,
          totalItems: listsRes.data.batches.reduce(
            (acc: number, batch: any) => acc + batch.count,
            0
          ),
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-[90%] ml-auto px-9 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          Welcome to your agent list management system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="card cursor-pointer group"
          onClick={() => navigate("/agents")}
        >
          <div className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                Agents
              </p>
              <h3 className="mt-1 text-3xl font-semibold text-[hsl(var(--foreground))]">
                {stats.totalAgents}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[hsl(var(--primary))/10] group-hover:bg-[hsl(var(--primary))/20] transition-colors">
              <Users size={24} className="text-[hsl(var(--primary))]" />
            </div>
          </div>
          <div className="px-6 py-3 bg-[hsl(var(--primary))/5] group-hover:bg-[hsl(var(--primary))/10] transition-colors">
            <p className="text-sm text-[hsl(var(--primary))]">
              View all agents →
            </p>
          </div>
        </div>

        <div
          className="card cursor-pointer group"
          onClick={() => navigate("/lists")}
        >
          <div className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                Uploaded Lists
              </p>
              <h3 className="mt-1 text-3xl font-semibold text-[hsl(var(--foreground))]">
                {stats.totalLists}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[hsl(var(--secondary))/10] group-hover:bg-[hsl(var(--secondary))/20] transition-colors">
              <FileSpreadsheet
                size={24}
                className="text-[hsl(var(--secondary))]"
              />
            </div>
          </div>
          <div className="px-6 py-3 bg-[hsl(var(--secondary))/5] group-hover:bg-[hsl(var(--secondary))/10] transition-colors">
            <p className="text-sm text-[hsl(var(--secondary))]">
              Manage lists →
            </p>
          </div>
        </div>

        <div
          className="card cursor-pointer group"
          onClick={() => navigate("/lists")}
        >
          <div className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                Distributed Items
              </p>
              <h3 className="mt-1 text-3xl font-semibold text-[hsl(var(--foreground))]">
                {stats.totalItems}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-[hsl(var(--accent))/10] group-hover:bg-[hsl(var(--accent))/20] transition-colors">
              <FileCheck size={24} className="text-[hsl(var(--accent))]" />
            </div>
          </div>
          <div className="px-6 py-3 bg-[hsl(var(--accent))/5] group-hover:bg-[hsl(var(--accent))/10] transition-colors">
            <p className="text-sm text-[hsl(var(--accent))]">
              View distribution →
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </div>
          <div className="card-body grid grid-cols-1 gap-4">
            <button
              onClick={() => navigate("/agents")}
              className="btn btn-outline w-full justify-start"
            >
              <Users size={18} className="mr-2" />
              Manage Agents
            </button>
            <button
              onClick={() => navigate("/lists")}
              className="btn btn-outline w-full justify-start"
            >
              <FileSpreadsheet size={18} className="mr-2" />
              Upload New List
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Getting Started</h3>
          </div>
          <div className="card-body">
            <ol className="list-decimal ml-5 space-y-2">
              <li>Add agents to your system</li>
              <li>Upload CSV or Excel files with lead data</li>
              <li>System will automatically distribute leads to agents</li>
              <li>Monitor agent performance and list distribution</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
