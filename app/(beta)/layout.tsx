import Banner from "../../components/banner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Banner />
      {children}
    </div>
  );
}