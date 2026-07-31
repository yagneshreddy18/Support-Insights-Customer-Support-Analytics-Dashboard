const ApiResponse = require('../utils/apiResponse');
const { mockStore, getNextId } = require('../models/store');

const getCategories = async (req, res, next) => {
  try {
    const categories = mockStore.categories.map(c => {
      const ticketCount = mockStore.tickets.filter(t => t.category_id === c.id).length;
      return { ...c, ticket_count: ticketCount };
    });

    return ApiResponse.success(res, 'Categories retrieved successfully.', categories);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const existing = mockStore.categories.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      return ApiResponse.error(res, 'Category name already exists.', 400);
    }

    const newCat = {
      id: getNextId(mockStore.categories),
      name,
      description: description || '',
      is_active: 1,
      created_at: new Date(),
      updated_at: new Date()
    };

    mockStore.categories.push(newCat);

    return ApiResponse.success(res, 'Category created successfully.', newCat, 201);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cat = mockStore.categories.find(c => c.id === parseInt(id, 10));
    if (!cat) return ApiResponse.error(res, 'Category not found.', 404);

    const { name, description, is_active } = req.body;
    if (name) cat.name = name;
    if (description !== undefined) cat.description = description;
    if (is_active !== undefined) cat.is_active = is_active ? 1 : 0;
    cat.updated_at = new Date();

    return ApiResponse.success(res, 'Category updated successfully.', cat);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idx = mockStore.categories.findIndex(c => c.id === parseInt(id, 10));
    if (idx === -1) return ApiResponse.error(res, 'Category not found.', 404);

    mockStore.categories.splice(idx, 1);
    return ApiResponse.success(res, 'Category deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
