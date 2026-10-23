import { useCallback, useEffect, useState } from "react";
import { Trophy, Users, Plus, Trash2, RefreshCw, Shield } from "lucide-react";
import "./App.css";

const API = "http://localhost:8080/api";

const emptyForm = { name: "", jerseyNumber: "", position: "Forward" };

// Only send Content-Type when there is a body. Sending it on GET/DELETE
// triggers an extra CORS preflight request for no reason.
async function request(url, options = {}) {
  const headers = { ...options.headers };
  if (options.body) headers["Content-Type"] = "application/json";

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function App() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);

  const loadTeams = useCallback(async () => {
    try {
      const data = await request(`${API}/teams`);
      const list = Array.isArray(data) ? data : [];
      setTeams(list);
      setSelectedTeam((current) =>
        list.some((t) => String(t.id) === String(current))
          ? current
          : list.length
          ? String(list[0].id)
          : ""
      );
      setError("");
    } catch (err) {
      setError(`Cannot load teams: ${err.message}. Is Spring Boot running on port 8080?`);
    }
  }, []);

  const loadPlayers = useCallback(async (teamId) => {
    if (!teamId) {
      setPlayers([]);
      return [];
    }
    const data = await request(`${API}/teams/${teamId}/players`);
    return Array.isArray(data) ? data : [];
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  // "cancelled" stops an older, slower response from overwriting the
  // players of the team the user clicked most recently.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadPlayers(selectedTeam)
      .then((list) => {
        if (!cancelled) {
          setPlayers(list);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setPlayers([]);
          setError(`Could not load players: ${err.message}`);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedTeam, loadPlayers]);

  async function refreshPlayers() {
    try {
      setPlayers(await loadPlayers(selectedTeam));
      setError("");
    } catch (err) {
      setError(`Could not load players: ${err.message}`);
    }
  }

  function refreshAll() {
    loadTeams();
    refreshPlayers();
  }

  async function addPlayer(event) {
    event.preventDefault();
    if (!selectedTeam) {
      setError("Select a team first.");
      return;
    }

    try {
      await request(`${API}/teams/${selectedTeam}/players`, {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          jerseyNumber: Number(form.jerseyNumber),
          position: form.position,
        }),
      });
      setForm(emptyForm);
      await refreshPlayers();
    } catch (err) {
      setError(`Player could not be saved: ${err.message}`);
    }
  }

  async function deletePlayer(player) {
    if (!window.confirm(`Delete ${player.name}?`)) return;

    try {
      await request(`${API}/players/${player.id}`, { method: "DELETE" });
      await refreshPlayers();
    } catch (err) {
      setError(`Delete failed: ${err.message}`);
    }
  }

  const team = teams.find((t) => String(t.id) === String(selectedTeam));

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon"><Trophy size={23} /></span>
          <span>Football<span className="accent">HQ</span></span>
        </div>
        <div className="admin-label">
          <Shield size={16} /> TEAM ADMIN
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">CLUB MANAGEMENT / DASHBOARD</p>
          <h1>Manage your <span>squad.</span></h1>
          <p className="subtitle">Your teams, your players, all in one place.</p>
        </div>
        <div className="hero-ball">⚽</div>
      </section>

      <section className="stats">
        <article className="stat-card">
          <span className="stat-icon"><Trophy /></span>
          <div><p>Total Teams</p><h2>{teams.length}</h2></div>
        </article>
        <article className="stat-card">
          <span className="stat-icon"><Users /></span>
          <div><p>Squad Members</p><h2>{players.length}</h2></div>
        </article>
        <article className="stat-card">
          <span className="stat-icon"><Shield /></span>
          <div><p>Selected Team</p><h2 className="team-stat">{team?.name || "None"}</h2></div>
        </article>
      </section>

      {error && (
        <div className="error-message" role="alert">
          {error}
          <button type="button" onClick={refreshAll}>Retry</button>
        </div>
      )}

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR CLUBS</p>
            <h2>Choose a team</h2>
          </div>
          <button type="button" className="refresh-btn" onClick={refreshAll}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        <div className="team-grid">
          {teams.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={`team-card ${String(item.id) === String(selectedTeam) ? "selected" : ""}`}
              onClick={() => setSelectedTeam(String(item.id))}
            >
              <span className={`team-crest crest-${index % 3}`}>
                {item.name?.slice(0, 1).toUpperCase()}
              </span>
              <span className="team-info">
                <strong>{item.name}</strong>
                <small>Football Club</small>
              </span>
              <span className="team-arrow">→</span>
            </button>
          ))}
        </div>
      </section>

      <section className="workspace">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SQUAD OVERVIEW</p>
            <h2>{team?.name || "Select a team"} players</h2>
          </div>
          <span className="count-badge">{players.length} players</span>
        </div>

        <div className="content-grid">
          <section className="panel player-panel">
            <div className="panel-heading">
              <h3>Player roster</h3>
              <span className="live-dot">DATABASE</span>
            </div>

            {loading ? (
              <p className="empty">Loading players...</p>
            ) : players.length === 0 ? (
              <div className="empty">
                <Users size={34} />
                <p>No players in this team yet.</p>
                <small>Add your first player using the form.</small>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>PLAYER</th>
                      <th>POSITION</th>
                      <th>NO.</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player) => (
                      <tr key={player.id}>
                        <td>
                          <div className="player-name">
                            <span className="avatar">
                              {player.name?.charAt(0)?.toUpperCase()}
                            </span>
                            <strong>{player.name}</strong>
                          </div>
                        </td>
                        <td>{player.position}</td>
                        <td><span className="jersey">#{player.jerseyNumber}</span></td>
                        <td>
                          <button
                            type="button"
                            className="delete-btn"
                            title="Delete player"
                            aria-label={`Delete ${player.name}`}
                            onClick={() => deletePlayer(player)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="panel form-panel">
            <div className="panel-heading">
              <h3><Plus size={19} /> Add player</h3>
            </div>
            <form onSubmit={addPlayer}>
              <label htmlFor="player-name">Player name</label>
              <input
                id="player-name"
                placeholder="e.g. Magesh N"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                maxLength={100}
              />

              <label htmlFor="player-jersey">Jersey number</label>
              <input
                id="player-jersey"
                type="number"
                placeholder="e.g. 10"
                min="1"
                max="99"
                value={form.jerseyNumber}
                onChange={(e) => setForm({ ...form, jerseyNumber: e.target.value })}
                required
              />

              <label htmlFor="player-position">Playing position</label>
              <select
                id="player-position"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
              >
                <option>Forward</option>
                <option>Midfielder</option>
                <option>Defender</option>
                <option>Goalkeeper</option>
              </select>

              <label htmlFor="player-team">Team</label>
              <select
                id="player-team"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                required
              >
                {teams.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>

              <button className="submit-btn" type="submit" disabled={!teams.length}>
                <Plus size={18} /> Save player
              </button>
              <p className="form-note">
                Player details will be sent to your Spring Boot API.
              </p>
            </form>
          </section>
        </div>
      </section>

      <footer>FOOTBALLHQ <span>•</span> TEAM MANAGEMENT SYSTEM</footer>
    </main>
  );
}

export default App;