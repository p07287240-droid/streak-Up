import { useState, useEffect } from "react";
import api from "../api/axios";

function Habits({ user }) {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/habits", {
        params: {
          ownerId: user.id,
        },
      })
      .then((res) => {
        setHabits(res.data);
      })
      .catch(() => setError("Could not load habits. Check that the backend is running."));
  }, [user.id]);

  const addHabit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setError("");
    try {
      const res = await api.post("/habits", {
        title: title.trim(),
        ownerId: user.id,
      });
      setHabits((current) => [...current, res.data]);
      setTitle("");
    } catch (err) {
      setError(err.response?.data?.error || "Could not add habit.");
    }
  };
  const checkIn = async (id) => {
    try {
      const res = await api.patch(`/habits/${id}/check-in`);
      setHabits((current) =>
        current.map((habit) =>
          habit._id === id ? res.data : habit
        )
      );
    } catch (err) {
      setError(err.response?.data?.error || "Could not check in.");
    }
  };
  const deleteHabit = async (id) => {
    try {
      await api.delete(`/habits/${id}`);
      setHabits((current) => current.filter((habit) => habit._id !== id));
    } catch (err) {
      setError("Could not delete habit.");
    }
  };
  const isCheckedToday = (date) => date && new Date(date).toDateString() === new Date().toDateString();
  const initials = user.name?.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <div className="dashboard">
      <header className="top-header">
        <div className="brand"><span className="brand-icon" aria-hidden="true">🔥</span><div><h1>StreakUp</h1><p>/habits · MERN capstone</p></div></div>
        <div className="tech-badges"><span>React</span><span>Express</span><span>MongoDB</span></div>
      </header>
      <section className="user-bar">
        <div className="user-info"><div className="avatar" aria-hidden="true">{initials}</div><div><h2>{user.name}</h2><p>{user.email}</p></div></div>
        <form className="add-habit-form" onSubmit={addHabit}>
          <input aria-label="New habit" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a habit…" />
          <button type="submit">+ Add Habit</button>
        </form>
      </section>
      <main className="habits-section">
        <div className="section-heading"><div><h2>Your Habits</h2><p>Build consistency one day at a time.</p></div><span className="habit-count">{habits.length} {habits.length === 1 ? "habit" : "habits"}</span></div>
        {error && <p className="dashboard-error" role="alert">{error}</p>}
        {habits.length === 0 ? (
          <div className="empty-state"><span className="empty-icon">🔥</span><h2>No habits yet</h2><p>Add your first habit above to start your streak.</p></div>
        ) : (
          <div className="habits-grid">
            {habits.map((habit) => {
              const checkedToday = isCheckedToday(habit.lastCheckIn);
              return (
                <article className="habit-card" key={habit._id}>
                  <div className="habit-top"><h3>{habit.title}</h3><button className="delete-button" type="button" aria-label={`Delete ${habit.title}`} onClick={() => deleteHabit(habit._id)}>×</button></div>
                  <div className="streak-box"><span className="fire-icon">🔥</span><strong>{habit.streak || 0}</strong><span>day streak</span></div>
                  <button className={`check-button${checkedToday ? " checked" : ""}`} type="button" disabled={checkedToday} onClick={() => checkIn(habit._id)}>{checkedToday ? "✓ Checked in today" : "Check in"}</button>
                </article>
              );
            })}
          </div>
        )}
        <footer className="api-footer"><span className="method post">POST</span><code>/auth/login</code><span className="arrow">→</span><span className="method get">GET</span><code>/habits</code><span className="arrow">→</span><span className="method patch">PATCH</span><code>/habits/:id/check-in</code></footer>
      </main>
    </div>
  );
}

export default Habits;
