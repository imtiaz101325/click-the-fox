import { LOCAL_STORAGE_KEYS } from "../constants";
import Button from "../components/Button";

export default function ScoreBoard({ handlePlay, handleWelcome }) {
  const history = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.HISTORY)) || [];
  
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h2 className="text-2xl font-bold mb-6 text-zinc-800">Top Scores</h2>
      
      {history.length === 0 ? (
        <p className="text-zinc-600 italic mb-6">No scores recorded yet. Play a game!</p>
      ) : (
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-amber-100">
                  <th className="py-3 px-4 text-left text-zinc-800 font-semibold">Player</th>
                  <th className="py-3 px-4 text-left text-zinc-800 font-semibold">Date</th>
                  <th className="py-3 px-4 text-right text-zinc-800 font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, index) => (
                  <tr 
                    key={index} 
                    className={`border-t border-amber-100 ${index === 0 ? "bg-amber-50" : ""}`}
                  >
                    <td className="py-3 px-4 text-zinc-800 font-medium">{entry.name}</td>
                    <td className="py-3 px-4 text-zinc-600 text-sm">
                      {new Date(entry.time).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-zinc-800">
                      {entry.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <Button onClick={handlePlay}>
          Play Again
        </Button>
        <button
          onClick={handleWelcome}
          className="mt-2 sm:mt-4 px-6 py-3 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-semibold tracking-wide text-lg rounded-xl shadow-md transition duration-200"
        >
          Back to Welcome
        </button>
      </div>
    </div>
  );
}
