import { Coins } from "lucide-react";

export default function ModuleCard({ module }: { module: any }) {
  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "from-emerald-400 to-emerald-600";
    if (percentage >= 80) return "from-blue-400 to-blue-600";
    if (percentage >= 70) return "from-amber-400 to-amber-600";
    return "from-red-400 to-red-600";
  };

  const getGradeLabel = (percentage: number) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Good";
    if (percentage >= 70) return "Fair";
    return "Needs Improvement";
  };

  const getGradeBadgeColor = (percentage: number) => {
    if (percentage >= 90) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (percentage >= 80) return "bg-blue-50 text-blue-700 border-blue-200";
    if (percentage >= 70) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-red-50 text-red-700 border-red-200";
  };

  return (
    <div className="group bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors">
          {module.timeTableName}
        </h4>
        <div className="flex items-center gap-1 text-amber-500">
          <Coins className="h-4 w-4" />
          <span className="text-sm font-bold">{module.coins}</span>
        </div>
      </div>

      {/* Performance */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500">Performance</span>
          <span className="text-sm font-semibold text-gray-900">
            {module.averagePercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 bg-gradient-to-r ${getGradeColor(
              module.averagePercentage
            )} transition-all duration-700`}
            style={{ width: `${module.averagePercentage}%` }}
          />
        </div>
      </div>

      {/* Grade Badge */}
      <div
        className={`text-xs px-2 py-1 rounded-full border font-medium w-fit ${getGradeBadgeColor(
          module.averagePercentage
        )}`}
      >
        {getGradeLabel(module.averagePercentage)}
      </div>
    </div>
  );
}
