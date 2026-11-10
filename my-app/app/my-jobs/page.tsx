"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

interface Application {
  id: string;
  status: string;
  coverLetter: string;
  createdAt: Date;
  job: {
    id: string;
    title: string;
    description: string;
    tags: string[];
  };
}
const Applications = () => {
  const { data: session, status: sessionStatus } = useSession();
  const user = session?.user;

  const [jobs, setJobs] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/jobs/${user?.id}`);
        const data = await res.json();
        setJobs(data.jobs);
      } catch (error) {
        console.error("error");
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  if (sessionStatus === "loading" || loading) {
    return (
      <div className="h-[calc(100vh-90px)] flex items-center justify-center">
        <Loader2 className="text-accent animate-spin" />
      </div>
    );
  }
  return (
    <div>
      <div className="min-h-[calc(100vh-64px)] w-full max-w-5xl mx-auto ">
        <h2 className="mb-5">Jobs I Applied</h2>

        <div className="space-y-4">
          {jobs?.map((app) => (
            <div key={app.id} className="p-5 border rounded">
              {/* JOB */}
              <h2>Status: {app.status}</h2>
              <div className="flex flex-col gap-5">
                <div className="">
                  <h2 className="text-xl font-bold">Job</h2>
                  <p className="">{app.job?.title}</p>
                  <p className="">{app.job?.description}</p>
                  <div className="flex items-start gap-3">
                    {app.job?.tags?.map((tag, i) => (
                      <p key={i} className="px-2 whitespace-nowrap py-0.5 bg-muted rounded text-xs">
                        {tag}
                      </p>
                    ))}
                  </div>
                </div>

                {/* COVER LETTER */}
                <div className="">
                  <h2 className="text-xl font-bold">Resume</h2>
                  <p className="">{app.coverLetter}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Applications;
