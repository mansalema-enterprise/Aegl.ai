/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  BarChart3,
  BookOpen,
  Camera,
  Settings,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RequestManagementAccount } from "@/components/business/RequestManagementAccount";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/integrations/firebase/client";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export const BusinessDashboardContent = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    processedEntries: 0,
    pendingRequests: 0,
    totalRevenue: 0,
  });

  // Fetch recent documents / ledger entries
  useEffect(() => {
    const fetchRecentActivity = async () => {
      const q = query(
        collection(db, "documents"),
        orderBy("uploadedAt", "desc"),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const activity: any[] = [];
      querySnapshot.forEach((doc) => {
        activity.push({ id: doc.id, ...doc.data() });
      });
      setRecentActivity(activity);
      setStats({
        totalDocuments: activity.length,
        processedEntries: activity.filter((a) => a.status === "processed")
          .length,
        pendingRequests: activity.filter((a) => a.status === "pending").length,
        totalRevenue: activity.reduce((sum, a) => sum + (a.total || 0), 0),
      });
    };
    fetchRecentActivity();
  }, []);

  const quickActions = [
    {
      title: t("business.uploadDocuments"),
      description: t("business.uploadDocumentsDesc"),
      icon: Upload,
      href: "/business-upload",
      color: "bg-blue-500",
    },
    {
      title: t("business.viewDocuments"),
      description: t("business.viewDocumentsDesc"),
      icon: FileText,
      href: "/business-documents",
      color: "bg-green-500",
    },
    {
      title: t("business.ocrScanner"),
      description: t("business.ocrScannerDesc"),
      icon: Camera,
      href: "/business-ocr",
      color: "bg-purple-500",
    },
    {
      title: t("business.generalLedger"),
      description: t("business.generalLedgerDesc"),
      icon: BookOpen,
      href: "/general-ledger",
      color: "bg-orange-500",
    },
    {
      title: t("business.reports"),
      description: t("business.reportsDesc"),
      icon: BarChart3,
      href: "/business-reports",
      color: "bg-red-500",
    },
    {
      title: t("business.profileSettings"),
      description: t("business.profileSettingsDesc"),
      icon: Settings,
      href: "/profile-settings",
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {t("business.dashboardTitle")}
        </h2>
        <p className="text-muted-foreground">
          {t("business.dashboardSubtitle")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">
              {t("business.totalDocuments")}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              {t("business.totalDocsDesc")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">
              {t("business.processedEntries")}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processedEntries}</div>
            <p className="text-xs text-muted-foreground">
              {t("business.processedEntriesDesc")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">
              {t("business.pendingRequests")}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              {t("business.pendingRequestsDesc")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">
              {t("business.totalRevenue")}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("business.totalRevenueDesc")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Management Account Request Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <RequestManagementAccount />

        {/* Recent Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t("common.recentActivity")}</CardTitle>
            <CardDescription>
              {t("business.recentActivitiesDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>{t("common.noRecentActivity")}</p>
                <p className="text-sm">{t("common.uploadToSeeActivity")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 border rounded hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(
                            doc.uploadedAt.seconds * 1000
                          ).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {doc.status === "processed" ? (
                          <span className="text-green-600">Processed</span>
                        ) : (
                          <span className="text-orange-600">Pending</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          {t("common.quickActions")}
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="hover:bg-accent/50 cursor-pointer transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-md ${action.color}`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-base">{action.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="mb-3">
                  {action.description}
                </CardDescription>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(action.href)}
                  className="w-full"
                >
                  {t("common.access")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
