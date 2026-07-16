export default function newHome() {
  return (
    <div className="md:p-16 w-screen h-svh">
      <div className="h-full flex place-items-center w-full">
        <div className="md:w-1/3 p-6 h-full place-content-between flex flex-col">
          <div className="text-4xl">Logan Whitten</div>
          <img
            src="/images/me.jpeg"
            className=" h-1/3 md:h-2/3 rounded-md object-cover"
          />
          <div className="">
            Lighting Integrator & Programmer Studying @{" "}
            <a href="https://uncsa.edu">UNCSA.</a>
          </div>
          <div className="flex gap-1 mt-1">
            <a
              className="animate-[fadeInSuperDelay_1.5s_ease-in-out]"
              href="https://github.com/loganwhitten/"
              target="_blank"
            >
              <img id="socialIcon" src="/images/github.svg" />
            </a>
            <a
              href="https://instagram.com/loganwhitten512"
              className="animate-[fadeInSuperDelay_2s_ease-in-out]"
              target="_blank"
            >
              <img id="socialIcon" src="/images/instagram.svg" />
            </a>
            <a
              href="https://linkedin.com/in/loganwhitten"
              className="animate-[fadeInSuperDelay_2.5s_ease-in-out]"
              target="_blank"
            >
              <img id="socialIcon" src="/images/linkedin.svg" />
            </a>
          </div>
        </div>
        <div className="w-full md:grid select-none grid-cols-3 gap-4 mr-4 flex h-full flex-col">
          <a className="transition group flex place-items-center place-content-center text-center">
            <div className="text-2xl absolute z-10">Integration</div>
            <img
              className="transition rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl  duration-300 ease-in-out
transform group-hover:opacity-50 opacity-60 md:opacity-10 object-cover h-full"
              src="/images/integration.jpeg"
            />
          </a>
          <a className="transition group flex place-items-center place-content-center text-center">
            <div className="text-2xl absolute z-10">School</div>
            <img
              className="transition  duration-300 ease-in-out
transform group-hover:opacity-50 opacity-80 md:opacity-10 object-cover h-full"
              src="/images/school.jpeg"
            />
          </a>
          <a className="transition group flex place-items-center place-content-center text-center">
            <div className="md:text-2xl text-xl absolute z-10">
              Side Projects
            </div>
            <img
              className="transition rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl  duration-300 ease-in-out
transform group-hover:opacity-50 opacity-40 md:opacity-10 object-cover h-full"
              src="/images/boom.jpeg"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
