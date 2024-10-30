/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function useQuery() {
  const [params, setParams] = useSearchParams();
  const [paramsData, setParamsData] = useState<any>();

  useEffect(() => {
    params.forEach((value, key) => {
      setParamsData((prev: any) => ({
        ...prev,
        [key]: value === "undefined" ? "" : value,
      }));
    });
  }, [params]);

  return {
    ...paramsData,
    setParams,
  };
}
