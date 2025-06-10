import { NextResponse } from 'next/server';

// Mock database statistics
const databaseStats = {
  tables: [
    {
      name: "users",
      rows: 2847,
      size: "12.5 MB",
      lastModified: "2024-12-06 14:30:00",
    },
    {
      name: "articles",
      rows: 1234,
      size: "45.2 MB",
      lastModified: "2024-12-06 13:45:00",
    },
    {
      name: "newsletters",
      rows: 156,
      size: "2.1 MB",
      lastModified: "2024-12-05 16:20:00",
    },
    {
      name: "subscribers",
      rows: 8921,
      size: "3.8 MB",
      lastModified: "2024-12-06 12:15:00",
    },
    {
      name: "comments",
      rows: 5432,
      size: "8.9 MB",
      lastModified: "2024-12-06 11:30:00",
    },
  ],
  metrics: {
    totalTables: 5,
    totalRows: 18590,
    totalSize: "72.5 MB",
    lastBackup: "2024-12-06 02:00:00",
    backupSize: "45.2 MB",
    serverLoad: "23%",
    queryPerformance: "Good",
  },
  activity: {
    dailyQueries: 3245,
    peakTime: "10:00 - 11:00",
    slowQueries: 12,
    errorRate: "0.3%",
    activeConnections: 28,
  },
  weeklyActivity: [
    { day: "Monday", queries: 3100, errors: 9 },
    { day: "Tuesday", queries: 3245, errors: 12 },
    { day: "Wednesday", queries: 3050, errors: 8 },
    { day: "Thursday", queries: 2980, errors: 7 },
    { day: "Friday", queries: 2800, errors: 6 },
    { day: "Saturday", queries: 1200, errors: 2 },
    { day: "Sunday", queries: 900, errors: 1 },
  ],
};

export async function GET() {
  return NextResponse.json(databaseStats);
} 