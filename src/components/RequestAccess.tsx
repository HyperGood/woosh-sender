import React from "react";
import Button from "./Button";

export default function RequestAccess() {
  return (
    <Button
      onClick={() => {
        return;
      }}
      size="full"
      intent="secondary"
    >
      Request Access
    </Button>
  );
}
