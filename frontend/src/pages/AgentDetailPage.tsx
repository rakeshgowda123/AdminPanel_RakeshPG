import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import { User, Phone, Mail, Calendar, ArrowLeft, FileText } from "lucide-react";
import Loader from "../components/Loader";

interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface ListItem {
  _id: string;
  firstName: string;
  phone: string;
  notes: string;
  uploadBatch: string;
  createdAt: string;
}

interface Batch {
  _id: string;
  count: number;
  date: string;
}

const AgentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>("all");

  useEffect(() => {
    if (id) {
      fetchAgentDetails(id);
    }
  }, [id]);

  const fetchAgentDetails = async (agentId: string) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/lists/agent/${agentId}`);
      setAgent(data.agent);
      setListItems(data.assignedItems);
      setBatches(data.batches);
    } catch (error) {
      toast.error("Failed to load agent details");
      navigate("/agents");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getFilteredItems = () => {
    if (selectedBatch === "all") {
      return listItems;
    }
    return listItems.filter((item) => item.uploadBatch === selectedBatch);
  };

  const filteredItems = getFilteredItems();

  if (loading) {
    return <Loader />;
  }

  if (!agent) {
    return (
      <div className="w-[90%] ml-auto px-9 space-y-6 text-center p-8">
        <h2 className="text-xl font-semibold mb-4">Agent not found</h2>
        <button className="btn btn-primary" onClick={() => navigate("/agents")}>
          <ArrowLeft size={18} className="mr-2" />
          Back to Agents
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        className="btn btn-ghost inline-flex items-center"
        onClick={() => navigate("/agents")}
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Agents
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Agent Details Card */}
        <div className="card">
          <div className="card-body">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 bg-[hsl(var(--primary))] text-white rounded-full flex items-center justify-center mb-4">
                <User size={40} />
              </div>
              <h2 className="text-xl font-bold">{agent.name}</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <Mail
                  size={18}
                  className="text-[hsl(var(--muted-foreground))] mr-3"
                />
                <span>{agent.email}</span>
              </div>
              <div className="flex items-center">
                <Phone
                  size={18}
                  className="text-[hsl(var(--muted-foreground))] mr-3"
                />
                <span>{agent.phone}</span>
              </div>
              <div className="flex items-center">
                <FileText
                  size={18}
                  className="text-[hsl(var(--muted-foreground))] mr-3"
                />
                <span>{filteredItems.length} assigned items</span>
              </div>
            </div>

            {batches.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Filter by Upload</h3>
                <select
                  className="input w-full"
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                >
                  <option value="all">
                    All Uploads ({listItems.length} items)
                  </option>
                  {batches.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      Batch {batch._id.slice(-8)} ({batch.count} items)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Assigned Items */}
        <div className="md:col-span-2 card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Assigned Items</h2>
          </div>

          {filteredItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[hsl(var(--muted))]">
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Notes
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(var(--border))]">
                  {filteredItems.map((item) => (
                    <tr key={item._id} className="hover:bg-[hsl(var(--muted))]">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium">
                          {item.firstName}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm">{item.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className="text-sm max-w-xs truncate"
                          title={item.notes}
                        >
                          {item.notes || "-"}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center text-xs text-[hsl(var(--muted-foreground))]">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(item.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-8 text-[hsl(var(--muted-foreground))]">
              <FileText
                size={48}
                className="mx-auto mb-4 text-[hsl(var(--muted-foreground))]"
              />
              {listItems.length > 0 ? (
                <p>No items found in the selected batch</p>
              ) : (
                <p>No items assigned to this agent yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPage;
