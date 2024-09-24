import {useQuery} from "@tanstack/react-query";

import {type CommitActivity, OwnerRepo, ErrorResponse} from "../types/types";

export const useCommitActivity = (formValues: OwnerRepo) => {
  const {
    data: weeks,
    isPending,
    isSuccess,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["data", formValues],
    queryFn: async ({signal}) => {
      const response = await fetch(
        `https://api.github.com/repos/${formValues.owner}/${formValues.repo}/stats/commit_activity`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "concourse-challenge",
          },
          signal,
        },
      );

      if (!response.ok) {
        const error = (await response.json()) as ErrorResponse;

        throw new Error(`${response.status} - ${error.message.split(". (")[0]}`);
      }

      const data = (await response.json()) as CommitActivity[];

      if (Object.keys(data).length === 0) {
        throw new Error(`${response.status} Accepted - Wait a few seconds and try again`);
      }

      return data.map((week) => {
        return {
          days: week.days.map((day) => day),
          total: week.total,
          week: week.week * 1000 + new Date(week.week * 1000).getTimezoneOffset() * 60000, //Unix timestamp in seconds to miliseconds in GMT +0000
        } as CommitActivity;
      });
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    weeks,
    isPending,
    isSuccess,
    isError,
    error,
    refetch,
  };
};
