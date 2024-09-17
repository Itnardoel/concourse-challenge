import {useCommitActivity} from "../hooks/useCommitActivity";
import {type OwnerRepo} from "../types/types";

type CommitActivityProps = {
  formValues: OwnerRepo;
};

export default function CommitActivityGraph({formValues}: CommitActivityProps) {
  const {weeks, isSuccess, isPending, isError, error} = useCommitActivity(formValues);

  if (isPending) {
    return <div className="m-4 h-[261px] w-[1248px] animate-pulse rounded bg-slate-700" />;
  }

  if (isError && error) {
    return <span className="text-center text-xl font-semibold text-red-500">{error.message}</span>;
  }

  if (isSuccess && weeks) {
    return (
      <section
        className="m-4 grid scale-90 grid-flow-col gap-1 overflow-auto"
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
    );
  }
}
