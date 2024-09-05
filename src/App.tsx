import {useQuery} from "@tanstack/react-query";
import "./App.css";

type CommitActivity = {
  days: number[];
  total: number;
  week: number;
};

function App() {
  const {
    data: weeks,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.github.com/repos/facebook/react/stats/commit_activity",
      );

      return (await response.json()) as CommitActivity[];
    },
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  console.log(weeks);

  return (
    <section
      className="grid grid-flow-col gap-1"
      style={{
        gridTemplateColumns: `repeat(${weeks.length}, auto)`,
        gridTemplateRows: `repeat(${weeks[0].days.length + 1}, auto)`,
      }}
    >
      <span />
      {weeks[0].days.map((_, index) => (
        <span key={index} className="even:invisible">
          {new Date(weeks[0].week * 1000 + 86400000 * (index + 1)).toLocaleString("en-US", {
            weekday: "short",
          })}
        </span>
      ))}
      {weeks.map((week, index) => [
        <span
          key={week.week}
          className={
            new Date(weeks[index].week * 1000).getMonth() ===
            new Date(weeks[index - 1]?.week * 1000).getMonth()
              ? "invisible"
              : ""
          }
        >
          {new Date(week.week * 1000).toLocaleString("en-US", {month: "short"})}
        </span>,
        week.days.map((day, index) => (
          <span key={week.week * 1000 + 86400000 * (index + 1)} className="bg-green-800">
            {day}
          </span>
        )),
      ])}
    </section>
  );
}

export default App;
