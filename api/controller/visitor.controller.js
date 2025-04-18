import { Visitor } from "../model/visitor.model.js";

// Example: In your Express route

export const newVisitor = async (req, res) => {
    try {
      console.log("📌 Visitor endpoint hit");
      const newVisitor = new Visitor({ visitedAt: new Date() });
      await newVisitor.save();
      console.log("✅ Visitor saved:", newVisitor);
      res.status(200).json(newVisitor);
    } catch (err) {
      console.error("❌ Error saving visitor:", err);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  
  export const getVisitorCount = async (req, res) => {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now);
      const oneWeekAgo = new Date(now);
      const oneMonthAgo = new Date(now);
      const oneYearAgo = new Date(now);
  
      oneDayAgo.setDate(now.getDate() - 1);
      oneWeekAgo.setDate(now.getDate() - 7);
      oneMonthAgo.setDate(now.getDate() - 30);
      oneYearAgo.setFullYear(now.getFullYear() - 1);
  
      // 💥 Daily Visitors (last 24 hours)
      const dailyVisitors = await Visitor.countDocuments({
        visitedAt: { $gte: oneDayAgo },
      });
  
      // 📅 Weekly Visitors (grouped by day)
      const weeklyVisitors = await Visitor.aggregate([
        {
          $match: { visitedAt: { $gte: oneWeekAgo } },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$visitedAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      // 📆 Monthly Visitors (grouped by day)
      const monthlyVisitors = await Visitor.aggregate([
        {
          $match: { visitedAt: { $gte: oneMonthAgo } },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$visitedAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      // 📈 Yearly Visitors (grouped by month)
      const yearlyVisitors = await Visitor.aggregate([
        {
          $match: { visitedAt: { $gte: oneYearAgo } },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$visitedAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      res.status(200).json({
        dailyVisitors,
        weeklyVisitors,
        monthlyVisitors,
        yearlyVisitors,
      });
    } catch (error) {
      console.error("Error fetching visitor stats", error);
      res.status(500).json({ message: "Failed to fetch visitor stats" });
    }
  };
  
  