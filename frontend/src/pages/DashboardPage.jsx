import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import RightPanel from "../components/dashboard/RightPanel";
import KPICards from "../components/dashboard/KPICards";
import Footer from "../components/common/Footer";
import { getRecommendation } from "../api/automlApi";

const DashboardPage = () => {
  const datasetId = localStorage.getItem("dataset_id");
  const targetColumn = localStorage.getItem("target_column");

  const { data: recommendationData, isLoading } = useQuery({
    queryKey: ["recommendation", datasetId, targetColumn],
    queryFn: () => getRecommendation(datasetId),
    enabled: !!datasetId && !!targetColumn,
  });

  const algoPerformanceData =
    recommendationData?.recommendations?.map((algo) => ({
      name: algo.name,
      accuracy: algo.accuracy,
      time: algo.training_time,
    })) || [];

  // Mock feature importance (minimal demo-safe)
  const featureImportanceData =
    recommendationData?.reason_parts?.map((r, index) => ({
      name: `Factor ${index + 1}`,
      value: Math.floor(Math.random() * 100),
    })) || [];

  return (
    <>
      <RightPanel />

      <div className="xl:pr-72 w-full transition-all duration-300">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-base-content mb-2">
              Dashboard
            </h1>
            <p className="text-base-content/60">
              Project:{" "}
              <span className="text-base-content font-semibold">
                AutoML Analysis
              </span>
            </p>
          </div>
        </div>

        <KPICards />

        {isLoading && (
          <div className="text-center text-base-content/60 py-10">
            Generating model insights...
          </div>
        )}

        {!isLoading && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-base-200 border border-base-content/10 p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-4 text-base-content">
                  Algorithm Benchmark
                </h3>
                <div className="h-64 w-full">
                  {!targetColumn && (
                    <div className="text-center text-warning py-10">
                      Please select a target column in preprocessing first.
                    </div>
                  )}

                  {algoPerformanceData.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={algoPerformanceData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="accuracy" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="bg-base-200 border border-base-content/10 p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-4 text-base-content">
                  Feature Importance
                </h3>
                <div className="h-64 w-full">
                  {featureImportanceData.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={featureImportanceData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-base-200 border border-base-content/10 rounded-xl overflow-hidden mb-6">
              <div className="p-6 border-b border-base-content/10">
                <h3 className="text-lg font-bold text-base-content">
                  Algorithm Recommendation Ranking
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="table w-full text-left">
                  <thead>
                    <tr>
                      <th className="pl-6">Rank</th>
                      <th>Algorithm</th>
                      <th>Accuracy</th>
                      <th>Training Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recommendationData?.recommendations?.map((algo, index) => (
                      <tr key={index}>
                        <td className="pl-6 font-bold">#{index + 1}</td>
                        <td>{algo.name}</td>
                        <td>{algo.accuracy}%</td>
                        <td>{algo.training_time}s</td>
                        <td>{index === 0 ? "Recommended" : "Alternative"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        <Footer />
      </div>
    </>
  );
};

export default DashboardPage;
