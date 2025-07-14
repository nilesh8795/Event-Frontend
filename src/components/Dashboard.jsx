import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("playerToken");

      const res = await fetch(`${apiBaseUrl}/match/getmatch`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setMatches(data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleJoinMatch = async (matchId) => {
    try {
      const token = localStorage.getItem("playerToken");

      const res = await fetch(`${apiBaseUrl}/match/joinmatch/${matchId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Joined match successfully!`);
        fetchMatches(); 
      } else {
        setMessage(data.message || "Unable to join match.");
      }
    } catch (error) {
      setMessage("Error joining match.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Active Tournaments</h1>

      {message && (
        <p className="text-center text-green-600 font-semibold mb-4">{message}</p>
      )}

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading matches...</p>
      ) : matches.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No active matches found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div
              key={match._id}
              className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-blue-600 mb-2">{match.map}</h2>

              <ul className="text-gray-700 space-y-1 text-sm mb-3">
                <li><strong>Entry Fee:</strong> ₹{match.entryFee}</li>
                <li><strong>Prize:</strong> {match.prize}</li>
                <li><strong>Game Mode:</strong> {match.gameMode}</li>
                <li><strong>Winning Criteria:</strong> {match.winningCriteria}</li>
                <li><strong>Start Time:</strong> {new Date(match.matchStartTime).toLocaleString()}</li>
              </ul>

              <p className="text-sm text-green-600 mb-4 font-medium">
                Status: {match.status}
              </p>

              <button
                onClick={() => handleJoinMatch(match._id)}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Join Match
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
