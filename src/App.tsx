import {useState} from "react";

import {type OwnerRepo} from "./types/types";
import CommitActivityGraph from "./components/CommitActivity";
import {useCommitActivity} from "./hooks/useCommitActivity";

function App() {
  const [formValues, setFormValues] = useState({
    owner: "facebook",
    repo: "react",
  });
  const {isPending, refetch} = useCommitActivity(formValues);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target as HTMLFormElement)) as OwnerRepo;

    if (JSON.stringify(formValues) === JSON.stringify(data)) {
      refetch();
    }

    event.currentTarget.reset();

    setFormValues(() => ({
      owner: data.owner.trim().toLowerCase(),
      repo: data.repo.trim().toLowerCase(),
    }));
  }

  return (
    <main className="container m-auto grid min-h-screen place-content-center">
      <header className="my-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold">Commit Activity</h1>
        <h2 className="text-2xl font-semibold">
          {formValues.owner} - {formValues.repo}
        </h2>
      </header>
      <CommitActivityGraph formValues={formValues} />
      <section className="m-4 flex scale-90 items-center justify-end gap-2 pt-2">
        <span className="text-2xl">Less</span>
        <div className="size-7 rounded" style={{backgroundColor: "var(--lightest)"}} />
        <div className="size-7 rounded" style={{backgroundColor: "var(--lighter)"}} />
        <div className="size-7 rounded" style={{backgroundColor: "var(--base)"}} />
        <div className="size-7 rounded" style={{backgroundColor: "var(--darker)"}} />
        <div className="size-7 rounded" style={{backgroundColor: "var(--darkest)"}} />
        <span className="text-2xl">More</span>
      </section>
      <form className="my-4 flex w-full flex-col items-center gap-2" onSubmit={handleSubmit}>
        <label htmlFor="owner">Owner:</label>
        <input
          required
          className="flex-grow rounded px-2 focus:outline-slate-700"
          disabled={isPending}
          name="owner"
          placeholder="facebook"
          type="text"
        />
        <label htmlFor="repo">Repo:</label>
        <input
          required
          className="flex-grow rounded px-2"
          disabled={isPending}
          name="repo"
          placeholder="react"
          type="text"
        />

        <button className="rounded border p-2 font-bold" disabled={isPending} type="submit">
          Submit
        </button>
      </form>
    </main>
  );
}

export default App;
