import Papa from 'papaparse';
import xlsx from 'xlsx';
import Agent from '../models/agentModel.js';
import ListItem from '../models/listItemModel.js';

// Helper function to parse CSV data
const parseCSV = (buffer) => {
  const csvString = buffer.toString();
  return new Promise((resolve, reject) => {
    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};

// Helper function to parse Excel data
const parseExcel = (buffer) => {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
};

// Helper function to distribute items among agents
const distributeItems = async (items, batchId) => {
  try {
    // Get all active agents
    const agents = await Agent.find({}).select('_id');
    
    if (agents.length === 0) {
      throw new Error('No agents found to distribute items');
    }
    
    // Create ListItems with agent assignments
    const listItems = [];
    const agentCount = agents.length;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const agentIndex = i % agentCount;
      
      const listItem = new ListItem({
        firstName: item.FirstName || '',
        phone: item.Phone || '',
        notes: item.Notes || '',
        assignedAgent: agents[agentIndex]._id,
        uploadBatch: batchId,
      });
      
      listItems.push(listItem);
    }
    
    // Save all items to database
    await ListItem.insertMany(listItems);
    
    // Update agents with their assigned items
    for (let i = 0; i < agentCount; i++) {
      const agentItems = listItems.filter((_, index) => index % agentCount === i);
      const itemIds = agentItems.map(item => item._id);
      
      await Agent.findByIdAndUpdate(
        agents[i]._id,
        { $push: { assignedItems: { $each: itemIds } } }
      );
    }
    
    return listItems;
  } catch (error) {
    throw new Error(`Error distributing items: ${error.message}`);
  }
};

// @desc    Upload and distribute list
// @route   POST /api/lists/upload
// @access  Private/Admin
export const uploadList = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a file');
    }

    let data;
    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    const batchId = Date.now().toString();

    // Parse file based on mime type
    if (mimeType === 'text/csv') {
      data = await parseCSV(fileBuffer);
    } else {
      // For Excel files
      data = parseExcel(fileBuffer);
    }

    // Validate data structure
    if (!data || data.length === 0) {
      res.status(400);
      throw new Error('No data found in the file');
    }

    // Check for required fields
    const requiredFields = ['FirstName', 'Phone'];
    const firstRow = data[0];
    
    const missingFields = requiredFields.filter(field => !Object.keys(firstRow).includes(field));
    
    if (missingFields.length > 0) {
      res.status(400);
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Distribute items among agents
    const distributedItems = await distributeItems(data, batchId);

    res.status(201).json({
      message: 'List uploaded and distributed successfully',
      itemCount: distributedItems.length,
      batchId,
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Get all distributed lists
// @route   GET /api/lists
// @access  Private/Admin
export const getDistributedLists = async (req, res) => {
  try {
    // Get unique batch IDs
    const batches = await ListItem.aggregate([
      { $group: { _id: '$uploadBatch', count: { $sum: 1 }, date: { $first: '$createdAt' } } },
      { $sort: { date: -1 } }
    ]);

    // Get distribution summary
    const distributionSummary = await Agent.aggregate([
      {
        $lookup: {
          from: 'listitems',
          localField: '_id',
          foreignField: 'assignedAgent',
          as: 'assignedItems'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
          totalAssigned: { $size: '$assignedItems' }
        }
      },
      { $sort: { name: 1 } }
    ]);

    res.status(200).json({
      batches,
      distributionSummary
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};

// @desc    Get lists assigned to a specific agent
// @route   GET /api/lists/agent/:agentId
// @access  Private/Admin
export const getListByAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    
    const agent = await Agent.findById(agentId).select('-password');
    
    if (!agent) {
      res.status(404);
      throw new Error('Agent not found');
    }
    
    const assignedItems = await ListItem.find({ assignedAgent: agentId })
      .sort({ createdAt: -1 });
    
    // Get batch information
    const batches = await ListItem.aggregate([
      { $match: { assignedAgent: agent._id } },
      { $group: { _id: '$uploadBatch', count: { $sum: 1 }, date: { $first: '$createdAt' } } },
      { $sort: { date: -1 } }
    ]);
    
    res.status(200).json({
      agent,
      assignedItems,
      batches
    });
  } catch (error) {
    res.status(res.statusCode || 500).json({
      message: error.message,
    });
  }
};