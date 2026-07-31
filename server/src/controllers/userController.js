const bcrypt = require('bcryptjs');
const ApiResponse = require('../utils/apiResponse');
const { mockStore, getNextId } = require('../models/store');

const getUsers = async (req, res, next) => {
  try {
    const { role_id, search, status } = req.query;
    let users = [...mockStore.users];

    if (role_id) {
      users = users.filter(u => u.role_id === parseInt(role_id, 10));
    }
    if (status) {
      users = users.filter(u => u.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      users = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }

    const hydrated = users.map(u => {
      const roleObj = mockStore.roles.find(r => r.id === u.role_id);
      const userCopy = { ...u, role_name: roleObj ? roleObj.name : 'Customer' };
      delete userCopy.password_hash;
      return userCopy;
    });

    return ApiResponse.success(res, 'Users retrieved successfully.', hydrated);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role_id = 2, bio = '' } = req.body;

    const existing = mockStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return ApiResponse.error(res, 'User with this email already exists.', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || 'password123', salt);

    const rId = parseInt(role_id, 10);
    const roleObj = mockStore.roles.find(r => r.id === rId);

    const newUser = {
      id: getNextId(mockStore.users),
      name,
      email,
      password_hash: passwordHash,
      role_id: rId,
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      bio: bio || `${roleObj ? roleObj.name : 'User'} team member`,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    };

    mockStore.users.push(newUser);

    const userCopy = { ...newUser, role_name: roleObj ? roleObj.name : 'Customer' };
    delete userCopy.password_hash;

    return ApiResponse.success(res, 'User created successfully.', userCopy, 201);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = mockStore.users.find(u => u.id === parseInt(id, 10));
    if (!user) return ApiResponse.error(res, 'User not found.', 404);

    const { name, role_id, status, bio } = req.body;
    if (name) user.name = name;
    if (role_id) user.role_id = parseInt(role_id, 10);
    if (status) user.status = status;
    if (bio !== undefined) user.bio = bio;
    user.updated_at = new Date();

    const roleObj = mockStore.roles.find(r => r.id === user.role_id);
    const userCopy = { ...user, role_name: roleObj ? roleObj.name : 'Customer' };
    delete userCopy.password_hash;

    return ApiResponse.success(res, 'User updated successfully.', userCopy);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const idx = mockStore.users.findIndex(u => u.id === parseInt(id, 10));
    if (idx === -1) return ApiResponse.error(res, 'User not found.', 404);

    mockStore.users.splice(idx, 1);
    return ApiResponse.success(res, 'User deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};
