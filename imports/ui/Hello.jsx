// imports/ui/Hello.jsx
import React, { useState } from 'react';

export const Hello = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <button onClick={() => setCounter(counter + 1)}>Click Me</button>
      <p>You've pressed the button {counter} times.</p>
    </div>
  );
};
