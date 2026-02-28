import { useState } from "react";
import useEstimates from "../useEstimates";
import EstimateList from "./EstimateList";
import EstimateDetail from "./EstimateDetail";
import NewEstimate from "./NewEstimate";

export default function EstimatorShell() {
  const { estimates, addEstimate, updateEstimate, nextId, resetData } = useEstimates();
  const [screen, setScreen] = useState("list");
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <div style={{
      maxWidth: 720, margin: "0 auto", padding: "0 16px",
      minHeight: "100vh", background: "var(--cream, #F7F5F0)", position: "relative",
      fontFamily: "var(--font-sans, 'DM Sans', sans-serif)",
    }}>
      {screen === "list" && (
        <EstimateList
          estimates={estimates}
          onSelect={est => { setSelected(est); setScreen("detail"); }}
          onNew={() => setScreen("new")}
          onReset={resetData}
          filter={filter} setFilter={setFilter}
          search={search} setSearch={setSearch}
        />
      )}

      {screen === "detail" && selected && (
        <EstimateDetail
          key={selected.id}
          estimate={selected}
          onBack={() => setScreen("list")}
          onUpdate={(updated) => {
            updateEstimate(updated);
            setSelected(updated);
          }}
        />
      )}

      {screen === "new" && (
        <NewEstimate
          onBack={() => setScreen("list")}
          nextId={nextId}
          onSave={(est) => {
            addEstimate(est);
            setSelected(est);
            setScreen("detail");
          }}
        />
      )}
    </div>
  );
}
