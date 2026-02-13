import React, { useState } from "react";
import LoadingSpinner from "./src/shared/components/UIElements/LoadingSpinner";

const TestSpinner = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div>
      <button onClick={() => setLoading((prev) => !prev)}>
        Toggle Spinner
      </button>
      {loading && <LoadingSpinner asOverlay />}
    </div>
  );
};

export default TestSpinner;
