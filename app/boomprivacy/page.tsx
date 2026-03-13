export default function Page() {
  return (
    <div className="flex h-full place-items-center place-content-center">
      boom uses posthog analytics, their privacy policy can be found{" "}
      <a
        className="pl-1 underline hover:no-underline"
        href="https://posthog.com/privacy"
      >
        {" "}
        here
      </a>.
    </div>
  );
}
