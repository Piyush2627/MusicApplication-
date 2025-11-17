import MusicCdImage from "../assets/images/MusicCd.png";
import GuyWithGuitar from "../assets/images/pexels-yabee-1656066.jpg";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="text-gray-800">
      <div className="flex justify-center">
        <nav className="fixed top-0 z-50 mt-4 w-1/2 rounded-3xl bg-black shadow-md backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
            <div className="flex items-center space-x-4">
              <p className="text-2xl font-bold text-amber-400">
                The Raaga Music
              </p>
            </div>
            {/* Buttons */}
            <div className="flex items-center space-x-4">
              <Link to={"/login"}>
                <button className="rounded-md px-4 py-2 text-sm text-white transition hover:text-amber-400">
                  Login
                </button>
              </Link>
              <Link to={"/signup"}>
                <button className="rounded-md bg-amber-500 px-4 py-2 text-sm text-black transition hover:bg-amber-400">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative flex flex-col-reverse items-center justify-center overflow-hidden bg-linear-to-b from-white via-white to-amber-400 px-6 py-16 md:h-screen md:flex-row">
        <div className="z-10 text-center md:text-left">
          <h1 className="font-shockwave mb-6 text-3xl font-bold tracking-wider sm:text-5xl md:text-6xl lg:text-7xl">
            Music
            <br />
            Learning at Your Doorstep
          </h1>
          <p className="font-dreamyChocolate text-lg sm:text-2xl md:text-3xl">
            Experience the joy of learning music{" "}
            <br className="hidden sm:block" />
            from professional instructors, anytime, anywhere.
          </p>
        </div>

        <div className="w-full md:w-auto">
          <img
            className="absolute -top-42 -right-24 h-[400px] opacity-80 sm:visible md:h-[400px] lg:h-[500px]"
            src={MusicCdImage}
            alt="Music CD Illustration"
          />
        </div>
        <div className="w-full md:w-auto">
          <img
            className="absolute -bottom-0 -left-42 h-[400px] opacity-80 sm:visible md:h-[400px] lg:h-[300px]"
            src={MusicCdImage}
            alt="Music CD Illustration"
          />
        </div>
      </section>

      <div></div>
      {/* Instruments Section */}
      <section className="bg-amber-400 px-6 py-16 text-white">
        <h2 className="font-shockwave mb-10 text-center text-8xl font-semibold tracking-wider">
          Instruments & Courses
        </h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Guitar",
              desc: "Acoustic & Electric Guitar lessons from basics to advanced techniques.",
            },
            {
              title: "Vocals",
              desc: "Learn voice control, pitch, and performance for both western and Bollywood vocals.",
            },
            {
              title: "Piano/Keyboard",
              desc: "Master melodies and chords through interactive piano lessons.",
            },
            {
              title: "Indian Classical",
              desc: "Learn Hindustani and Carnatic styles including Raag, Taal, and Bhajans.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl bg-black p-6 shadow-lg transition hover:bg-gray-700 hover:shadow-lg"
            >
              <h3 className="mb-2 text-xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="text-sm text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative bg-gradient-to-br from-gray-900 to-black px-6 py-20 text-white">
        <div className="mx-auto flex h-screen w-screen max-w-6xl flex-col items-center justify-center text-center">
          <div>
            <h2 className="font-dreamyChocolate mb-4 text-6xl font-extrabold tracking-wider">
              Why Choose <span className="text-amber-400">Raaga Musical?</span>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-300">
              Personalized music lessons brought to your doorstep – accessible,
              structured, and result-driven for all age groups.
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  text: "Open to All Age Groups – Everyone is welcome!",
                },
                {
                  text: "Structured Syllabus: From Basic to Advanced.",
                },
                {
                  text: "Bi-annual Exams by Recognized International Boards.",
                },
                { emoji: "🎓", text: "Indian Classical Visharad Instructors." },
                {
                  emoji: "🌟",
                  text: "Performance Opportunities & Stage Confidence.",
                },
                { text: "Stage Performance & Mic Training." },
                { text: "Regular Guided Practice Sessions." },
                { text: "Guest Trainer Masterclasses." },
                { text: "No Instrument? Rentals Available!" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-amber-500/30"
                >
                  <p className="text-gray-200">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Optional gradient blur decoration */}
        <div className="pointer-events-none absolute top-10 right-10 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl" />
      </section>

      <section className="relative overflow-hidden px-6 py-20 text-gray-900">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={GuyWithGuitar}
            alt="Background"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-white/10"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <div className="mb-12 flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-between sm:gap-0">
            <h2 className="text-4xl font-extrabold tracking-tight">
              <span className="font-shockwave text-8xl tracking-wider text-amber-500">
                Our Courses
              </span>
            </h2>
            <button className="mt-2 rounded-full border border-amber-300 px-5 py-2 text-sm font-medium text-amber-300 transition hover:bg-amber-100 hover:text-black">
              View More
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Singing Indian classical",
                desc: "Embark on a journey through the soulful melodies of Indian classical music.",
                price: "₹1,200",
              },
              {
                title: "Guitar learning",
                desc: "Strum your way to musical stardom!",
                price: "₹1,200",
              },
              {
                title: "Flute learning course Indian classical",
                desc: "Embark on a musical journey with our Indian classical Flute course!",
                price: "₹1,200",
              },
            ].map((course, index) => (
              <div
                key={index}
                className="rounded-xl border border-amber-100 bg-white/60 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-amber-300/40"
              >
                <h3 className="mb-2 text-xl font-semibold">{course.title}</h3>
                <p className="mb-4 text-sm text-gray-700">{course.desc}</p>
                <p className="text-lg font-bold">{course.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exams & Certifications */}
      <section className="bg-gray-50 px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-semibold">
          Music Exams & Certifications
        </h2>
        <div className="mx-auto max-w-3xl text-center text-gray-700">
          <p className="mb-4">
            Prepare for globally recognized certifications such as Trinity
            College London, ABRSM, and Prayag Sangeet Samiti.
          </p>
          <p>
            We provide complete guidance from syllabus to mock exams, ensuring
            high success rates for all levels.
          </p>
        </div>
      </section>

      {/* Current Students & Branches */}
      <section className="flex min-h-screen items-center justify-center bg-amber-400 px-6 py-20">
        <div className="w-full max-w-5xl text-center">
          <h2 className="font-shockwave mb-12 text-8xl font-extrabold tracking-wider text-black">
            Our Students & Branches
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {/* Card 1 */}
            <div className="rounded-2xl bg-black p-8 text-white shadow-xl backdrop-blur-md transition-transform hover:scale-105 hover:shadow-amber-500/30">
              <h3 className="text-2xl font-bold">50+ Active Students</h3>
              <p className="mt-2 text-sm text-gray-300">
                Across all age groups and levels
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl bg-black p-8 text-white shadow-xl backdrop-blur-md transition-transform hover:scale-105 hover:shadow-amber-500/30">
              <h3 className="text-2xl font-bold">5+ Instruments Nationwide</h3>
              <p className="mt-2 text-sm text-gray-300">
                Mumbai, Pune, Delhi, Bengaluru & Nagpur
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Concerts */}
      <section className="bg-gray-50 px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-semibold">
          Our Musical Concerts
        </h2>
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-6 text-gray-700">
            We believe in showcasing talent through real performance
            opportunities. Our students have performed in:
          </p>
          <ul className="inline-block list-inside list-disc text-left text-sm text-gray-600">
            <li>Annual Winter Concert – Band & Solo performances</li>
            <li>Indian Classical Night – Raag renditions by students</li>
            <li>Online Jam Sessions – Virtual performance showcases</li>
            <li>Community Events – Collaborations with schools & NGOs</li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 bg-amber-300 py-6 text-center text-black">
        <p>&copy; 2025 Raaga Music Academy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
