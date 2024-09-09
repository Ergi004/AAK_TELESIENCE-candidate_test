import { PairChartComponent } from "./components/PairChart";
import { BarChartComponent } from "./components/BarChart";
function App() {
  return (
    <div className="items-center flex h-screen mx-auto flex-wrap bg-slate-200 px-16 justify-evenly">
      <PairChartComponent />
      <BarChartComponent />
    </div>
  );
}

export default App;
