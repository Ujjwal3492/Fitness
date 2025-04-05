import React from "react";

const Hero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center  justify-center sm:flex sm:item-center sm:justify-start text-center md:text-left">
      <video
        autoPlay
        muted
        playsInline
        loop
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/mainVideo.mp4" type="video/mp4" />
      </video>
      <video
        src="/mainVideo"
        type="video/mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className=" md:pl-38 pt-25 z-10 text-white   ">
      <h1
  className="text-5xl md:text-6xl font-bold uppercase main-text text-center md:text-left md:leading-tight"
  style={{ fontFamily: "Oswald, sans-serif" }}
>
  <span className="block">FIND Your Balance,</span> 
  <span
    id="hero-text"
    className="bg-[#EC7E0B] text-white px-3 py-1 rounded-md inline-block shadow-lg"
  >
    Build Your Strength
  </span>
</h1>

        <p
          className="mt-4 text-xl opacity-90 main-text font-bold"
          style={{ fontFamily: "Lato, sans-serif" }}
        >
          Where Mind & Body Meet Peak Performance
        </p>

        <p
          className="mt-4 text-xl opacity-90 justify-center main-text font-bold "
          style={{ fontFamily: "Lato, sans-serif" }}
        >
          GYM || HIIT || YOGA
        </p>

        <button className="mt-6 px-6 py-3 bg-[#EC7E0B] text-white font-semibold uppercase rounded-lg shadow-lg hover:bg-orange-600 transition duration-300">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Hero;
