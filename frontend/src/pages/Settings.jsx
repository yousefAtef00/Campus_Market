import Reset from "./reset";
import { useState } from "react";

function Settings({ user, setPage }) {
  const [showReset, setShowReset] = useState(false);

  if (showReset) {
    return <Reset user={user} onBack={() => setShowReset(false)} />;
  }

  return (
    <div>
      <h2>Settings</h2>
      <button className="btn" onClick={() => setShowReset(true)}>
        Reset Password
      </button>
    </div>
  );
}

export default Settings;