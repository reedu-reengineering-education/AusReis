// path: src/components/email/MailExpenseCreated.tsx

import { Button } from "@react-email/button";
import { Html } from "@react-email/html";
import * as React from "react";

export default function MailExpenseCreated() {
  return (
    <Html>
      <Button
        href="https://example.com"
        style={{ background: "#000", color: "#fff" }}
      >
        Hello
      </Button>
    </Html>
  );
}
