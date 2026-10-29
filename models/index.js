import { sequelize } from "./db.js";
import { User } from "./userModel.js";
import { SystemSetting } from "./systemSettingModel.js";
import { ActivityLog } from "./activityLogModel.js";
import { Event } from "./eventModel.js";
import { Category } from "./categoryModel.js";
import { Criterion } from "./criterionModel.js";
import { Contestant } from "./contestantModel.js";
import { EventAssignment } from "./eventAssignmentModel.js";
import { ScoreSheet } from "./scoreSheetModel.js";
import { Score } from "./scoreModel.js";
import { TabulationResult } from "./tabulationResultModel.js";
import { Discrepancy } from "./discrepancyModel.js";
import { TabulationReport } from "./tabulationReportModel.js";
import { HomepageVideo } from "./homepageVideoModel.js";

User.hasMany(ActivityLog, { foreignKey: "userId" });
ActivityLog.belongsTo(User, { foreignKey: "userId", as: "actor" });

User.hasMany(Event, { foreignKey: "createdBy", as: "organizedEvents" });
Event.belongsTo(User, { foreignKey: "createdBy", as: "organizer" });
Event.belongsTo(User, { foreignKey: "resultsApprovedBy", as: "approver" });

Event.hasMany(Category, { foreignKey: "eventId", onDelete: "CASCADE" });
Category.belongsTo(Event, { foreignKey: "eventId" });

Event.hasMany(Criterion, { foreignKey: "eventId", onDelete: "CASCADE" });
Criterion.belongsTo(Event, { foreignKey: "eventId" });
Category.hasMany(Criterion, { foreignKey: "categoryId" });
Criterion.belongsTo(Category, { foreignKey: "categoryId" });

Event.hasMany(Contestant, { foreignKey: "eventId", onDelete: "CASCADE" });
Contestant.belongsTo(Event, { foreignKey: "eventId" });
Category.hasMany(Contestant, { foreignKey: "categoryId" });
Contestant.belongsTo(Category, { foreignKey: "categoryId" });

Event.hasMany(EventAssignment, { foreignKey: "eventId", onDelete: "CASCADE" });
EventAssignment.belongsTo(Event, { foreignKey: "eventId" });
User.hasMany(EventAssignment, { foreignKey: "userId" });
EventAssignment.belongsTo(User, { foreignKey: "userId", as: "official" });

Event.hasMany(ScoreSheet, { foreignKey: "eventId", onDelete: "CASCADE" });
ScoreSheet.belongsTo(Event, { foreignKey: "eventId" });
Contestant.hasMany(ScoreSheet, { foreignKey: "contestantId", onDelete: "CASCADE" });
ScoreSheet.belongsTo(Contestant, { foreignKey: "contestantId" });
User.hasMany(ScoreSheet, { foreignKey: "judgeId", as: "judgeSheets" });
ScoreSheet.belongsTo(User, { foreignKey: "judgeId", as: "judge" });

ScoreSheet.hasMany(Score, { foreignKey: "scoreSheetId", onDelete: "CASCADE" });
Score.belongsTo(ScoreSheet, { foreignKey: "scoreSheetId" });
Criterion.hasMany(Score, { foreignKey: "criterionId" });
Score.belongsTo(Criterion, { foreignKey: "criterionId" });

Event.hasMany(TabulationResult, { foreignKey: "eventId", onDelete: "CASCADE" });
TabulationResult.belongsTo(Event, { foreignKey: "eventId" });
Contestant.hasMany(TabulationResult, { foreignKey: "contestantId", onDelete: "CASCADE" });
TabulationResult.belongsTo(Contestant, { foreignKey: "contestantId" });
TabulationResult.belongsTo(User, { foreignKey: "tabulatedBy", as: "tabulator" });

Event.hasMany(Discrepancy, { foreignKey: "eventId", onDelete: "CASCADE" });
Discrepancy.belongsTo(Event, { foreignKey: "eventId" });
Discrepancy.belongsTo(Contestant, { foreignKey: "contestantId" });
Discrepancy.belongsTo(User, { foreignKey: "reportedBy", as: "reporter" });

Event.hasMany(TabulationReport, { foreignKey: "eventId", onDelete: "CASCADE" });
TabulationReport.belongsTo(Event, { foreignKey: "eventId" });
TabulationReport.belongsTo(User, { foreignKey: "generatedBy", as: "author" });

export {
  sequelize,
  User,
  SystemSetting,
  ActivityLog,
  Event,
  Category,
  Criterion,
  Contestant,
  EventAssignment,
  ScoreSheet,
  Score,
  TabulationResult,
  Discrepancy,
  TabulationReport,
  HomepageVideo,
};
