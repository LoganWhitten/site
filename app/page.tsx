import { HoverLinkPreview } from "@/components/ui/hover-link-preview";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-full w-full flex flex-col place-items-center place-content-center gap-4">
      <div className="flex flex-col place-items-center gap-1">
        <span className="text-4xl flex gap-1 place-items-center">
          Hey! I'm
          <HoverLinkPreview
            href="https://21st/dev/magic"
            previewImage="/images/logan.jpeg"
            imageAlt="Example preview"
          >
            Logan Whitten
          </HoverLinkPreview>
        </span>
        <span className="text-secondary-foreground text-2xl">
          developer, lighting designer, and programmer.
        </span>
      </div>
      <div>
        <div className="flex gap-1 flex-col place-items-center">
          <div>
            I'm currently working at:
            <HoverLinkPreview
              href="https://21st/dev/magic"
              previewImage="https://illuminated-integration.com/wp-content/uploads/2023/08/Website-Project-Cover-5-scaled-1-1536x628.jpg"
              imageAlt="Example preview"
            >
              Illuminated Integration
            </HoverLinkPreview>
          </div>
          <div>
            and in my spare time:
            <HoverLinkPreview
              href="https://21st/dev/magic"
              previewImage="https://21st.dev/magic-agent-og-image.png"
              imageAlt="Example preview"
            >
              Werknotes
            </HoverLinkPreview>
            <HoverLinkPreview
              href="https://21st/dev/magic"
              previewImage="https://21st.dev/magic-agent-og-image.png"
              imageAlt="Example preview"
            >
              Lighting Notes
            </HoverLinkPreview>
            <HoverLinkPreview
              href="https://21st/dev/magic"
              previewImage="https://21st.dev/magic-agent-og-image.png"
              imageAlt="Example preview"
            >
              GelDB
            </HoverLinkPreview>
          </div>
        </div>
      </div>
    </div>
  );
}
