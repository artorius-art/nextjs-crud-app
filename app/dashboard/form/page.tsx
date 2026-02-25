import { ComponentExample } from "@/components/component-example";
import { TabunganForm } from "./tabungan-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;

  return (
    <div className="flex flex-1 flex-col px-4 lg:px-6">
      <TabunganForm type={type} />
    </div>
  );
}