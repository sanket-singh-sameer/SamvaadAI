export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};

export const checkOwnership = (resourceModel) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const resource = await resourceModel.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found',
        });
      }

      if (req.user.role === 'admin') {
        return next();
      }

      if (resource.user && resource.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this resource',
        });
      }

      if (resource.userId && resource.userId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this resource',
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error in ownership check',
        error: error.message,
      });
    }
  };
};

export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const rolePermissions = {
      admin: [
        'create:any',
        'read:any',
        'update:any',
        'delete:any',
        'manage:users',
        'manage:roles',
      ],
      moderator: [
        'create:own',
        'read:any',
        'update:own',
        'delete:own',
        'moderate:content',
      ],
      user: ['create:own', 'read:own', 'update:own', 'delete:own'],
    };

    const userPermissions = rolePermissions[req.user.role] || [];

    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Permission '${permission}' required. Your role '${req.user.role}' does not have this permission.`,
      });
    }

    next();
  };
};

export const requireEmailVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email to access this resource',
    });
  }

  next();
};

export const requireActiveAccount = (req, res, next) => {
  if (!req.user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Your account is inactive. Please contact support.',
    });
  }

  next();
};
