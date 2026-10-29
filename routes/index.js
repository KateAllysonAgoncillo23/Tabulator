import express from "express";
import { tabulatorController } from "../controllers/tabulatorController.js";
import { User } from "../models/index.js";

const router = express.Router();

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);
const asyncController = (controller) =>
  Object.fromEntries(
    Object.entries(controller).map(([name, handler]) => [name, asyncHandler(handler)])
  );
const tabulatorActions = asyncController(tabulatorController);

// Middleware to auto-set tabulator user (no login required)
const autoSetTabulatorUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { role: "tabulator" } });
    if (user) {
      const plain = user.get({ plain: true });
      delete plain.password;
      req.user = plain;
      res.locals.currentUser = plain;
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Apply auto-login middleware to all routes
router.use(autoSetTabulatorUser);

// Direct access to tabulator - no authentication
router.get("/", tabulatorActions.dashboard);
router.get("/tabulator/dashboard", tabulatorActions.dashboard);
router.get("/tabulator/events", tabulatorActions.events);
router.get("/tabulator/submissions", tabulatorActions.submissions);
router.get("/tabulator/computation", tabulatorActions.computation);
router.post("/tabulator/computation/:id", tabulatorActions.compute);
router.get("/tabulator/discrepancies", tabulatorActions.discrepancies);
router.post("/tabulator/discrepancies", tabulatorActions.createDiscrepancy);
router.post("/tabulator/discrepancies/:id", tabulatorActions.updateDiscrepancy);
router.post("/tabulator/discrepancies/:id/delete", tabulatorActions.deleteDiscrepancy);
router.get("/tabulator/reports", tabulatorActions.reports);
router.post("/tabulator/reports", tabulatorActions.createReport);
router.get("/tabulator/reports/:id/pdf", tabulatorActions.downloadReportPdf);
router.post("/tabulator/reports/:id", tabulatorActions.updateReport);
router.post("/tabulator/reports/:id/delete", tabulatorActions.deleteReport);

export default router;
