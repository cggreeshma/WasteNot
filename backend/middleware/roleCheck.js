exports.sellerOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'seller') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. This action requires a seller account.',
    });
  }
  next();
};

exports.buyerOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'buyer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. This action requires a buyer account.',
    });
  }
  next();
};
