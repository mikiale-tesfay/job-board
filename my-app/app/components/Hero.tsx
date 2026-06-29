import React from "react";

const Hero = () => {
  return (
    <div className="h-100 flex flex-col items-center justify-center">
      <h2 className="uppercase text-4xl mb-5">Find Your Next remote or localtech job </h2>
      <p className="max-w-150 text-center capitalize text-2xl">discover 5,000+ verified software engineering and design positions</p>

      <div className="flex gap-5 mt-5 w-full justify-center items-center">
        <div className="relative shrink">
          <input type="text" name="" id="" className="p-2 border border-dashed pl-10" placeholder="Job title or keyword..." />
          <h2 className="absolute top-2 left-2">S</h2>
        </div>
        <div className="relative shrink">
          <input type="text" name="" id="" className="p-2 border border-dashed pl-10" placeholder="Job title or keyword..." />
          <h2 className="absolute top-2 left-2">S</h2>
        </div>

        <button className="shrink p-2 px-5 bg-red-500 text-white">Search Jobs</button>
      </div>
    </div>
  );
};

export default Hero;
