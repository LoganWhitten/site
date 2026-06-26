import { ChevronRight, Icon } from "lucide-react";

export default function Project({
  projectTitle,
  projectURL,
  projectDesc
}: {
  projectTitle: string;
  projectURL: string;
  projectDesc: string
}) {
  return (
    <a id="project" href={projectURL}>
      <div id="projectInfoDiv">
        <p className=" text-lg">{projectTitle}</p>
        <p className="text-xs">
          {projectDesc}
        </p>
      </div>
      <p id="projectProgress">
        {projectURL.startsWith('https://github.com') && (
            <img src="/images/github.svg" id="projectIcon" />
        )}
        <ChevronRight className="pl-1" />
      </p>
    </a>
  );
}
