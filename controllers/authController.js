import bcrypt from "bcrypt";
import { User } from "../models/index.js";
import { logActivity } from "../utils/activity.js";
import { roleHome } from "../middleware/auth.js";

export const loginPage = async (_req, res) => {
  res.render("login", { title: "Tabulator Sign In" });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    req.flash("error_msg", "No account was found for that email.");
    return res.redirect("/login");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    req.flash("error_msg", "Incorrect password.");
    return res.redirect("/login");
  }

  if (user.status !== "active") {
    req.flash("error_msg", "This account is inactive. Contact the administrator.");
    return res.redirect("/login");
  }

  // Only allow tabulator role
  if (user.role !== "tabulator") {
    req.flash("error_msg", "Access denied. Only tabulator accounts are allowed.");
    return res.redirect("/login");
  }

  req.session.userId = user.id;
  req.user = user.get({ plain: true });
  await logActivity(req, "Signed in", "Authentication", `${user.email} signed in.`);
  req.flash("success_msg", `Welcome back, ${user.name}.`);
  return res.redirect(roleHome(user.role));
};

export const logoutUser = async (req, res) => {
  if (req.session.userId) {
    await logActivity(req, "Signed out", "Authentication", "User signed out.");
  }
  req.session.destroy(() => res.redirect("/login"));
};
