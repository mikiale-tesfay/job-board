"use client";

import React, { useEffect, useState } from "react";

type Job = {
  id: string;
  title: string;
};

const MyJob = () => {
  const [job, setJob] = useState<Job>();

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/jobs");
    })();
  }, []);
  return (
    <div>
      <h2 className="text-2xl font-bold">{job?.title}</h2>
    </div>
  );
};

export default MyJob;
