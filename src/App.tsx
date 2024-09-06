import {useQuery} from "@tanstack/react-query";
// import "./App.css";

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

  return (
    <>
      <section
        className="m-4 grid grid-flow-col gap-1"
        style={{
          gridTemplateColumns: `repeat(${weeks.length + 1}, auto)`,
          gridTemplateRows: `repeat(${weeks[0].days.length + 1}, auto)`,
        }}
      >
        <span />
        {weeks[0].days.map((_, index) => (
          <span key={index} className="text-sm even:invisible">
            {new Date(weeks[0].week * 1000 + 86400000 * (index + 1)).toLocaleString("en-US", {
              weekday: "short",
            })}
          </span>
        ))}
        {weeks.map((week, index) => [
          <span
            key={week.week}
            className={`text-sm ${
              new Date(weeks[index].week * 1000).getMonth() ===
              new Date(weeks[index - 1]?.week * 1000).getMonth()
                ? "invisible"
                : ""
            } `}
          >
            {new Date(week.week * 1000).toLocaleString("en-US", {month: "short"})}
          </span>,
          week.days.map((day, index) => (
            <span
              key={week.week * 1000 + 86400000 * (index + 1)}
              className="size-7 rounded"
              style={{
                backgroundColor:
                  day === 0
                    ? "var(--lightest)"
                    : day < Math.floor(week.total / 4)
                      ? "var(--lighter)"
                      : day < Math.floor((week.total * 2) / 4)
                        ? "var(--base)"
                        : day < Math.floor((week.total * 3) / 4)
                          ? "var(--darker)"
                          : "var(--darkest)",
              }}
              title={`${day} contributions on ${new Date(week.week * 1000 + 86400000 * (index + 1)).toLocaleDateString("en-US", {month: "short", day: "numeric"})}`}
            />
          )),
        ])}
      </section>
      <section className="m-4 flex items-center justify-end gap-2 pt-2">
        <span className="text-2xl">Less</span>
        <div className="size-7 rounded" style={{backgroundColor: "var(--lightest)"}} />
        <div className="size-7 rounded" style={{backgroundColor: "var(--lighter)"}} />
        <div className="size-7 rounded" style={{backgroundColor: "var(--base)"}} />
        <div className="size-7 rounded" style={{backgroundColor: "var(--darker)"}} />
        <div className="size-7 rounded" style={{backgroundColor: "var(--darkest)"}} />
        <span className="text-2xl">More</span>
      </section>
    </>
  );
}

export default App;
