"use client";

import React, { useEffect } from "react";
import { WorkplaceType, JobType } from "../page";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export interface Application {
  id: string;
  coverLetter: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  type: JobType;
  workplace: WorkplaceType;
  location: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  tags: string[];
  responsibilities: string[];
  requirements: string[];
  isActive: boolean;
  isFeatured: boolean;
  postedOn: string | Date;
}

const MyJob = () => {
  const { id } = useParams();
  const [job, setJob] = React.useState<Job>();
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/jobs/${id}`);
        const data = await res.json();
        setJob(data.job);
      } catch (error) {
        console.error("error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/jobs/${id}/applications`);
        const data = await res.json();
        setApplications(data.applications);
        console.log(data);
        console.log(`/api/jobs/${id}/applications`);
      } catch (error) {
        console.error("error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-90px)] flex items-center justify-center">
        <Loader2 className="text-accent animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-5xl mx-auto ">
        <div className="mt-5 space-y-5">
          <h2>{job?.title}</h2>
          <p>{job?.description}</p>
          <div className="flex flex-wrap items-start gap-2">
            {job?.tags?.map((tag) => (
              <p className="px-2 py-px text-sm rounded bg-muted" key={tag}>
                {tag}
              </p>
            ))}
          </div>

          <p>{job?.type}</p>
          <p>{job?.location}</p>
          <p>{job?.salaryMin}</p>
        </div>

        <h2 className="mt-10 mb-3 text-lg font-bold">Applicants</h2>

        {applications?.length === 0 && <p className="text-sm text-foreground/60">No applicants yet</p>}

        {applications?.map((app) => (
          <div key={app?.id} className="flex items-center justify-between p-3 px-5 mt-2 bg-white rounded">
            <div>
              <h2>{app.user?.name}</h2>
              <p className="text-foreground/60">{app.user?.email}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MyJob;
