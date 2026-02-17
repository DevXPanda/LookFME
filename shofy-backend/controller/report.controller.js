const reportService = require("../services/report.service");

// Transaction Report Controller
exports.getTransactionReport = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const result = await reportService.getTransactionReport(
      month ? parseInt(month) : null,
      year ? parseInt(year) : null
    );
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Sales Report Controller
exports.getSalesReport = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const result = await reportService.getSalesReport(
      month ? parseInt(month) : null,
      year ? parseInt(year) : null
    );
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Profit Report Controller
exports.getProfitReport = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const result = await reportService.getProfitReport(
      month ? parseInt(month) : null,
      year ? parseInt(year) : null
    );
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Product Report Controller
exports.getProductReport = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const result = await reportService.getProductReport(
      month ? parseInt(month) : null,
      year ? parseInt(year) : null
    );
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Order Report Controller
exports.getOrderReport = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const result = await reportService.getOrderReport(
      month ? parseInt(month) : null,
      year ? parseInt(year) : null
    );
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// VAT Report Controller
exports.getVATReport = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const result = await reportService.getVATReport(
      month ? parseInt(month) : null,
      year ? parseInt(year) : null
    );
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Export Data Controller
exports.exportReportData = async (req, res, next) => {
  try {
    const { reportType, month, year } = req.query;
    
    if (!reportType) {
      return res.status(400).json({
        success: false,
        message: "Report type is required",
      });
    }
    
    const result = await reportService.getExportData(
      reportType,
      month ? parseInt(month) : null,
      year ? parseInt(year) : null
    );
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
