import { FileUser, Github, Instagram, Linkedin, Mail } from "lucide-react";

export default function Contact(){
    return (
      <div className="h-full lg:text-8xl text-6xl inset-0 fixed flex items-center justify-center text-center px-3 mix-blend-difference text-white">
        <h1 className="font-serif flex-col">
          <span className="italic  tracking-tight">Get in Touch</span>
          <div
            className="pt-2 z-50 relative flex flex-col md:flex-row w-full place-items-center place-content-center gap-4 transition-colors duration-1500 ease-in-out"
            style={{ color: "white" }}
          >
            <div className="flex z-50 gap-4">
              <a href="/LoganWhittenResume-11-07-25.pdf">
                <FileUser className="transition-transform duration-300 hover:scale-110" />
              </a>
              <a href="mailto:logan@loganwhitten.com">
                <Mail className="transition-transform duration-300 hover:scale-110" />
              </a>
              <a href="https://instagram.com/loganwhitten512">
                <Instagram className="transition-transform duration-300 hover:scale-110" />
              </a>
              <a href="https://www.linkedin.com/in/loganwhitten/">
                <Linkedin className="transition-transform duration-300 hover:scale-110" />
              </a>
              <a href="https://www.github.com/loganwhitten">
                <Github className="transition-transform duration-300 hover:scale-110" />
              </a>
            </div>
          </div>
        </h1>
      </div>
    );
}