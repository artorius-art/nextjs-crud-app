import { createClient } from "@/utils/supabase/server";
import { TabunganForm } from "../tabungan-form";

export default async function Page({
  params,
  searchParams,
}: {
    params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { id } = await params;          // ✅ unwrap
  const { mode } = await searchParams;  // ✅ unwrap

  const parsedId = parseInt(id);

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tabungan_master")
    .select("*")
    .eq("id", parsedId)
    .single();

  if (error || !data) {
    return<div className="flex flex-1 flex-col px-4 lg:px-6">
        <h1>
            {error?.message}
        </h1>
    </div>
  }

  return (
    <div className="flex flex-1 flex-col px-4 lg:px-6">
    <TabunganForm
      initialData={data}
      mode={mode}
    />
    </div>
  );
}