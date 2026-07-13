export const can = (user, action) => {
  if (!user || !user.role) return false;

  const role = user.role;

  const matrix = {
    'suppliers.create': ['admin', 'procurement_officer'],
    'suppliers.update': ['admin', 'procurement_officer'],
    'suppliers.delete': ['admin'],
    'contracts.create': ['admin', 'procurement_officer'],
    'contracts.update': ['admin', 'procurement_officer'],
    'contracts.delete': ['admin'],
    'evaluations.create': ['admin', 'procurement_officer'],
    'evaluations.approve': ['admin', 'procurement_manager'],
    'dashboard.manager': ['admin', 'procurement_manager'],
    'dashboard.admin': ['admin'],
  };

  const allowedRoles = matrix[action];
  if (!allowedRoles) {
    return false; 
  }

  return allowedRoles.includes(role);
};
