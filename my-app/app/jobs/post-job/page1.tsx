"use client";

// import { prisma } from "@/lib/db";
// interface JOB {
//   title: string;
//   description: string;
//   location: string;
// }

const PostJob = () => {
  const createJob = async () => {
    await fetch("/api/jobs", {
      method: "POST",
      headers: {
        ContentType: "application/json",
      },
      body: "",
    });

    // await prisma.job.create({
    //   data: {
    //     title: "title",
    //     description: "",
    //     tags: [],

    //     company: "Primax Tech",
    //     location: "Remote",
    //     type: "Full-Time",
    //     salary: "200k - 250k",
    //     postedBy: {
    //       connect: { id: "123" },
    //     },
    //   },
    // });
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <button onClick={createJob} className="p-2 bg-accent">
        Post
      </button>
    </div>
  );
};

export default PostJob;
