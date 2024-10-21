import { useState } from "react";

const BabaButton = () => {
  function handleSubmit(e: any) {
    e.preventDefault();
    const postData = async () => {
      const data = {
        title: e.title,
        post: e.post,
      };

      const response = await fetch("/api/email/send-email", {
        method: "POST",
      });
      return response.json();
    };
    postData().then((data) => {
      alert(data.message);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>// contents of form</div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default BabaButton;
