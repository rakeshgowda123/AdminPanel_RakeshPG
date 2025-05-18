import Agent from '../models/agentModel.js';
import ListItem from '../models/listItemModel.js';

// @desc    Create a new agent
// @route   POST /api/agents
// @access  Private/Admin
export const createAgent = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const agentExists = await Agent.findOne({ email });

    if (agentExists) {
      res.status(400);
      throw new Error('Agent already exists');
    }

    const agent = await Agent.create({
      name,
      email,
      phone,
      password,
    });

    if (agent) {
      res.status(201).json({
        _id: agent._id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
      });
    } else {
      res.status(400);
      throw new Error('Invalid agent data');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private/Admin
export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find({}).select('-password');
    res.status(200).json(agents);
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Get agent by ID
// @route   GET /api/agents/:id
// @access  Private/Admin
export const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select('-password');

    if (agent) {
      res.status(200).json(agent);
    } else {
      res.status(404);
      throw new Error('Agent not found');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Private/Admin
export const updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      res.status(404);
      throw new Error('Agent not found');
    }

    const { name, email, phone, password } = req.body;

    agent.name = name || agent.name;
    agent.email = email || agent.email;
    agent.phone = phone || agent.phone;
    
    if (password) {
      agent.password = password;
    }

    const updatedAgent = await agent.save();

    res.status(200).json({
      _id: updatedAgent._id,
      name: updatedAgent.name,
      email: updatedAgent.email,
      phone: updatedAgent.phone,
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private/Admin
export const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      res.status(404);
      throw new Error('Agent not found');
    }

    // Remove agent's ID from assigned items
    await ListItem.updateMany(
      { assignedAgent: agent._id },
      { $unset: { assignedAgent: 1 } }
    );

    await agent.deleteOne();
    res.status(200).json({ message: 'Agent removed' });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Get agent with assigned items
// @route   GET /api/agents/:id/assigned-items
// @access  Private/Admin
export const getAgentWithAssignedItems = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select('-password');
    
    if (!agent) {
      res.status(404);
      throw new Error('Agent not found');
    }

    const assignedItems = await ListItem.find({ assignedAgent: agent._id });

    res.status(200).json({
      agent,
      assignedItems
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};