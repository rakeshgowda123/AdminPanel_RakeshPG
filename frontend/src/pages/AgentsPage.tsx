import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import Loader from "../components/Loader";
import AgentForm from "../components/AgentForm";

interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/agents");
      setAgents(data);
    } catch (error) {
      toast.error("Failed to fetch agents");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAgent = () => {
    setCurrentAgent(null);
    setIsFormOpen(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setCurrentAgent(agent);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (agent: Agent) => {
    setAgentToDelete(agent);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!agentToDelete) return;

    try {
      await api.delete(`/api/agents/${agentToDelete._id}`);
      toast.success("Agent deleted successfully");
      setAgents(agents.filter((agent) => agent._id !== agentToDelete._id));
    } catch (error) {
      toast.error("Failed to delete agent");
      console.error(error);
    } finally {
      setIsDeleteModalOpen(false);
      setAgentToDelete(null);
    }
  };

  const handleFormClose = (shouldRefresh = false) => {
    setIsFormOpen(false);
    if (shouldRefresh) {
      fetchAgents();
    }
  };

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.phone.includes(searchTerm)
  );

  return (
    <div className="w-[90%] ml-auto px-9 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Agents</h1>
          <p className="text-[hsl(var(--muted-foreground))]">
            Manage your team of agents
          </p>
        </div>
        <button
          className="btn btn-primary sm:self-start flex-shrink-0"
          onClick={handleAddAgent}
        >
          <Plus size={18} className="mr-1" />
          Add Agent
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-[hsl(var(--border))]">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                size={18}
                className="text-[hsl(var(--muted-foreground))]"
              />
            </div>
            <input
              type="text"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8">
              <Loader />
            </div>
          ) : filteredAgents.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="bg-[hsl(var(--muted))]">
                  <th className="px-4 py-3 text-left text-sm font-medium text-[hsl(var(--foreground))]">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[hsl(var(--foreground))]">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[hsl(var(--foreground))]">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-[hsl(var(--foreground))]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border))]">
                {filteredAgents.map((agent) => (
                  <tr
                    key={agent._id}
                    className="hover:bg-[hsl(var(--muted))] cursor-pointer"
                  >
                    <td
                      className="px-4 py-4 whitespace-nowrap"
                      onClick={() => navigate(`/agents/${agent._id}`)}
                    >
                      <div className="text-sm font-medium">{agent.name}</div>
                    </td>
                    <td
                      className="px-4 py-4 whitespace-nowrap"
                      onClick={() => navigate(`/agents/${agent._id}`)}
                    >
                      <div className="text-sm">{agent.email}</div>
                    </td>
                    <td
                      className="px-4 py-4 whitespace-nowrap"
                      onClick={() => navigate(`/agents/${agent._id}`)}
                    >
                      <div className="text-sm">{agent.phone}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAgent(agent);
                        }}
                        className="icon-button text-[hsl(var(--foreground))]"
                        title="Edit agent"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(agent);
                        }}
                        className="icon-button text-[hsl(var(--error))]"
                        title="Delete agent"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center p-8 text-[hsl(var(--muted-foreground))]">
              <p className="mb-4">No agents found</p>
              <button className="btn btn-primary" onClick={handleAddAgent}>
                <Plus size={18} className="mr-1" />
                Add your first agent
              </button>
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <AgentForm agent={currentAgent} onClose={handleFormClose} />
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Delete Agent</h3>
              <p>
                Are you sure you want to delete {agentToDelete?.name}? This
                action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  className="btn btn-outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn bg-[hsl(var(--error))] text-white hover:bg-[hsl(var(--error))/90]"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentsPage;
