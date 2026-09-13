import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

// One rounded-up call for the dashboard home: stat counts + recent rows.
export const useDashboardStats = () => {
  const [data, setData] = useState({ stats: {}, appointments: [], signups: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    axiosInstance
      .get("/dashboard/stats")
      .then((res) => active && setData(res.data))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { ...data, loading };
};