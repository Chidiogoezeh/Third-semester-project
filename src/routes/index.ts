import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import eventRoutes from "../modules/events/event.routes";
import ticketRoutes from "../modules/tickets/ticket.routes";
import paymentRoutes from "../modules/payments/payment.routes";
import reminderRoutes from "../modules/reminders/reminder.routes";
import analyticsRoutes from "../modules/analytics/analytics.routes";
import userRoutes from "../modules/users/user.routes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/events", eventRoutes);

router.use("/tickets", ticketRoutes);

router.use("/payments", paymentRoutes);

router.use("/reminders", reminderRoutes);

router.use("/analytics", analyticsRoutes);

router.use("/users", userRoutes);

export default router;