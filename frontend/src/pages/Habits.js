import { useState, useEffect } from "react";
import api from "../api/axios";

function Habits({ user }) {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    api
      .get("/habits", {
        params: { ownerId: user.id },
      })
      .then((res) => setHabits(res.data))
      .catch(() => alert("Could not load habits"));
  }, [user.id]);

  const addHabit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a habit");
      return;
    }

    try {
      const res = await api.post("/habits", {
        title,
        ownerId: user.id,
      });

      setHabits([...habits, res.data]);
      setTitle("");
    } catch (err) {
      alert(
        err.response?.data?.error || "Could not add habit"
      );
    }
  };

  const checkIn = async (id) => {
    try {
      const res = await api.patch(
        `/habits/${id}/check-in`
      );

      setHabits(
        habits.map((habit) =>
          habit._id === id ? res.data : habit
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.error ||
          "Could not check in"
      );
    }
  };

  const deleteHabit = async (id) => {
    try {
      await api.delete(`/habits/${id}`);

      setHabits(
        habits.filter((habit) => habit._id !== id)
      );
    } catch (err) {
      alert("Could not delete habit");
    }
  };

  const isCheckedToday = (lastCheckIn) => {
    if (!lastCheckIn) return false;

    return (
      new Date(lastCheckIn).toDateString() ===
      new Date().toDateString()
    );
  };

  const getInitials = () => {
    if (!user.name) return "U";

    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="dashboard">

      {/* HEADER */}
      <header className="top-header">
        <div className="brand">
          <div className="brand-icon">🔥</div>

          <div>
            <h1>StreakUp</h1>
            <p>Build habits. Keep your streak.</p>
          </div>
        </div>

        <div className="tech-badges">
          <span>React</span>
          <span>Express</span>
          <span>MongoDB</span>
        </div>
      </header>

      {/* USER SECTION */}
      <section className="user-bar">

        <div className="user-info">
          <div className="avatar">
            {getInitials()}
          </div>

          <div>
            <h2>Welcome, {user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        <form
          className="add-habit-form"
          onSubmit={addHabit}
        >
          <input
            type="text"
            placeholder="Enter a new habit..."
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <button type="submit">
            + Add Habit
          </button>
        </form>

      </section>

      {/* HABITS */}
      <main className="habits-section">

        <div className="section-heading">
          <div>
            <h2>Your Habits</h2>
            <p>Stay consistent and build your streak.</p>
          </div>

          <span className="habit-count">
            {habits.length}{" "}
            {habits.length === 1
              ? "habit"
              : "habits"}
          </span>
        </div>

        <div className="habits-grid">

          {habits.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔥</div>

              <h2>No habits yet</h2>

              <p>
                Add your first habit and start
                building your streak.
              </p>
            </div>
          ) : (
            habits.map((habit) => {
              const checkedToday =
                isCheckedToday(
                  habit.lastCheckIn
                );

              return (
                <div
                  className="habit-card"
                  key={habit._id}
                >

                  <div className="habit-top">

                    <div className="habit-title">
                      <div className="habit-icon">
                        ✓
                      </div>

                      <h3>{habit.title}</h3>
                    </div>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteHabit(habit._id)
                      }
                    >
                      ×
                    </button>

                  </div>

                  <div className="streak-box">

                    <div className="fire-icon">
                      🔥
                    </div>

                    <div>
                      <strong>
                        {habit.streak}
                      </strong>

                      <span>
                        day streak
                      </span>
                    </div>

                  </div>

                  <button
                    className={
                      checkedToday
                        ? "check-button checked"
                        : "check-button"
                    }
                    disabled={checkedToday}
                    onClick={() =>
                      checkIn(habit._id)
                    }
                  >
                    {checkedToday
                      ? "✓ Checked in today"
                      : "Check in today"}
                  </button>

                </div>
              );
            })
          )}

        </div>
      </main>

      {/* FOOTER */}
      <footer className="api-footer">
        <span className="api-title">
          API FLOW
        </span>

        <span className="method post">
          POST
        </span>
        <span>/auth/login</span>

        <span className="arrow">→</span>

        <span className="method get">
          GET
        </span>
        <span>/habits</span>

        <span className="arrow">→</span>

        <span className="method patch">
          PATCH
        </span>
        <span>/habits/:id/check-in</span>
      </footer>

    </div>
  );
}

export default Habits;