module.exports = function(req, res, next) {
  const token = req.headers['x-admin-secret'];
  if (token && token === process.env.ADMIN_SECRET) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};
