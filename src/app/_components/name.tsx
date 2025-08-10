"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export const NameInput = () => {
  const [name, setName] = useState("");

  return (
    <form
      onSubmit={async () => {
        await signIn("uuid", { redirect: false, name });
      }}
    >
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">GO</button>
    </form>
  );
};
