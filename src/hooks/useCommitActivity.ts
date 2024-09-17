import {useQuery} from "@tanstack/react-query";

import {type CommitActivity, OwnerRepo} from "../types/types";

export const useCommitActivity = (formValues: OwnerRepo) => {
  const {
    data: weeks,
    isPending,
    isSuccess,
    isError,
    error,
  } = useQuery({
    queryKey: ["data", formValues],
    queryFn: async () => {
      const response = await fetch(
        `https://api.github.com/repos/${formValues.owner}/${formValues.repo}/stats/commit_activity`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "concourse-challenge",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`${response.status} - Error on fetch`);
      }

      const data = (await response.json()) as CommitActivity[];

      return data.map((week) => {
        return {
          days: week.days.map((day) => day),
          total: week.total,
          week: week.week * 1000 + new Date(week.week * 1000).getTimezoneOffset() * 60000, //Unix timestamp in seconds to miliseconds in GMT +0000
        } as CommitActivity;
      });
    },
    refetchOnWindowFocus: false,
    retry: 5,
    retryDelay: 10000,
  });

  return {
    weeks,
    isPending,
    isSuccess,
    isError,
    error,
  };
};
