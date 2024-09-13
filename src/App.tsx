import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
// import "./App.css";

type CommitActivity = {
  days: number[];
  total: number;
  week: number;
};

type OwnerRepo = {
  owner: string;
  repo: string;
};

function App() {
  const [formValues, setFormValues] = useState({
    owner: "facebook",
    repo: "react",
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target as HTMLFormElement)) as OwnerRepo;

    event.currentTarget.reset();

    setFormValues(() => ({
      owner: data.owner.trim().toLowerCase(),
      repo: data.repo.trim().toLowerCase(),
    }));
  }

  const {
    data: weeks,
    isPending,
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

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <main className="container m-auto grid min-h-screen place-content-center">
      <header className="flex flex-col items-center">
        <h1 className="mt-4 text-3xl font-bold">Commit Activity</h1>
        <h2 className="mt-4 text-2xl font-semibold">
          {formValues.owner} - {formValues.repo}
        </h2>
      </header>
      <section
        className="m-4 grid grid-flow-col gap-1 overflow-auto"
        style={{
          gridTemplateColumns: `repeat(${weeks.length + 1}, auto)`,
          gridTemplateRows: `repeat(${weeks[0].days.length + 1}, auto)`,
        }}
      >
        <span />
        {/* weekday column */}
        {weeks[0].days.map((_, index) => (
          <span
            key={new Date(weeks[0].week + index * 86400000).toLocaleString("en-US", {
              weekday: "short",
            })}
            className="text-sm even:invisible"
          >
            {new Date(weeks[0].week + index * 86400000).toLocaleString("en-US", {
              weekday: "short",
            })}
          </span>
        ))}
        {weeks.map((week, index) => [
          // Month of the week
          <span
            key={week.week}
            className={`text-sm ${
              new Date(weeks[index].week).getMonth() === new Date(weeks[index - 1]?.week).getMonth()
                ? "invisible"
                : ""
            } `}
          >
            {new Date(week.week).toLocaleString("en-US", {month: "short"})}
          </span>,
          week.days.map((day, index) => (
            // Days of the week
            <span
              key={week.week + 86400000 * index}
              className="size-7 rounded"
              style={{
                backgroundColor:
                  day === 0
                    ? "var(--lightest)"
                    : day < week.total / 4
                      ? "var(--lighter)"
                      : day < (week.total * 2) / 4
                        ? "var(--base)"
                        : day < (week.total * 3) / 4
                          ? "var(--darker)"
                          : "var(--darkest)",
              }}
              title={`${day} contributions on ${new Date(week.week + 86400000 * index).toLocaleDateString("en-US", {month: "short", day: "numeric"})}`}
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
      <form className="flex w-full flex-col items-center gap-2" onSubmit={handleSubmit}>
        <input
          required
          className="flex-grow rounded px-2"
          name="owner"
          placeholder="facebook"
          type="text"
        />

        <input
          required
          className="flex-grow rounded px-2"
          name="repo"
          placeholder="react"
          type="text"
        />

        <button className="rounded border p-2 font-bold" type="submit">
          Submit
        </button>
      </form>
    </main>
  );
}

export default App;
