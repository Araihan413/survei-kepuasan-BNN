

const requireRole = (role) => (req, res, next) => {
  if (req.admin?.role !== role) return res.status(403).json({status: "Forbidden", message: 'Access denied'})
  next()
}

module.exports = {requireRole}