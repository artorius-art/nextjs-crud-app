"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TabunganInput, tabunganSchema, type TabunganValues } from "@/lib/schema";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { BanknoteArrowDownIcon, BanknoteArrowUpIcon, Loader2, Pencil, Save } from "lucide-react";
// Base UI components (adjust paths based on your actual filenames)
import { Input } from "@/components/ui/input"; 
import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; 
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast, Toaster } from "sonner";
export function TabunganForm({
  initialData,
  type,
  mode,
}: {
  initialData?: TabunganValues & { id: number };
  type?: string;
  mode?: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const isViewMode = mode === "view";
  const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseLocalDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};
const {
  register,
  handleSubmit,
  control,
  formState: { errors, isSubmitting },
} = useForm<TabunganInput, any, TabunganValues>({
  resolver: zodResolver(tabunganSchema),
  defaultValues: initialData || {
    jenis: type ?? "",
    nominal: 0,
    keterangan: "",
    date: formatLocalDate(new Date()),
    is_pemasukan: true,
  },
});

const onSubmit = async (data: TabunganValues) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    alert("User not authenticated");
    return;
  }

  // Get display_name from profiles
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  if (profileError) {
    alert(profileError.message);
    return;
  }

  const finalData = {
    ...data,
    nominal: data.is_pemasukan
      ? Math.abs(data.nominal)
      : -Math.abs(data.nominal),
  };

  if (initialData) {
    // UPDATE
    const { error } = await supabase
      .from("tabungan_master")
      .update({
        ...finalData,
        modified_at: new Date().toISOString(),
        modified_by: user.email,
      })
      .eq("id", initialData.id);

    if (error) {
      alert(error.message);
      return;
    }

    toast.success("Updated Successfully!", {
      description: "Data berhasil diperbarui.",
      position: "top-center",
    });
  } else {
    // INSERT
    const { error } = await supabase.from("tabungan_master").insert([
      {
        ...finalData,
        created_by: user.email,
        created_by_name: profile?.display_name ?? "",
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    toast.success("Created Successfully!", {
      description: "Data berhasil disimpan.",
      position: "top-center",
    });
  }

    router.replace("/dashboard");
};
  return (
    <Card className="relative w-full max-w-sm overflow-hidden mx-auto">
      
         <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex flex-col gap-1">
              <CardTitle>Transaksi Tabungan {type ? `${type}` : ""}</CardTitle>
            </div>
            <Link href="/dashboard">
              <Button className="w-auto" variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
            </Link>
      </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} >
          {/* Jenis Field */}
          <CardContent className="flex flex-col space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Jenis</label>
            <Input {...register("jenis")} readOnly />
            {errors.jenis && <span className="text-xs text-red-500">{errors.jenis.message}</span>}
          </div>

          {/* Nominal Field */}
          <Controller
            control={control}
            name="nominal"
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Nominal</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={
                    field.value
                      ? new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(Number(field.value))
                      : ""
                  }
                  readOnly={isViewMode}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    field.onChange(raw ? Number(raw) : 0);
                  }}
                />
                {errors.nominal && (
                  <span className="text-xs text-red-500">
                    {errors.nominal.message}
                  </span>
                )}
              </div>
            )}
          />
          {/* Date Field */}
<Controller
  control={control}
  name="date"
  render={({ field }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">Tanggal</label>

      <Popover>
        <PopoverTrigger className={cn(
              buttonVariants({ variant: "outline", className: "justify-start text-left font-normal"}),
              "relative" // Add any extra positioning
              
            )}>
          {/* <Button
            type="button"
            variant="outline"
            className="justify-start text-left font-normal"
          > */}
            <CalendarIcon className="mr-2 h-4 w-4" />
            {field.value
              ? format(parseLocalDate(field.value), "dd MMMM yyyy")
              : "Pilih Tanggal"}
          {/* </Button> */}
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar disabled={isViewMode}
            mode="single"
            selected={field.value ? parseLocalDate(field.value) : undefined}
            onSelect={(date) => {
              if (!date) return field.onChange("");

              field.onChange(formatLocalDate(date));
            }}            
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {errors.date && (
        <span className="text-xs text-red-500">
          {errors.date.message}
        </span>
      )}
    </div>
  )}
/>
          {/* Keterangan Field */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Keterangan</label>
            <Textarea {...register("keterangan")} placeholder="Masukan Keterangan" />
          </div>

          {/* Pemasukan Toggle (Using Controller for Custom Components) */}
          <Controller
            control={control}
            name="is_pemasukan"
            render={({ field }) => (
              <div className="flex flex-col gap-2 mb-8">
                <label className="text-sm font-medium">Tipe Transaksi</label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Pemasukan */}
                  <div
                    onClick={() => !isViewMode && field.onChange(true)}
                    className={`group flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200
                      ${
                        field.value === true
                          ? "border-green-600 bg-secondary text-green-700 ring-2 ring-green-600"
                          : "border-muted hover:border-green-400 hover:bg-secondary"
                      }
                    `}
                  >
                    <BanknoteArrowUpIcon className={`h-8 w-8 transition-transform duration-200 ${
                        field.value === false ? "scale-110" : "group-hover:scale-110"
                      }`}/><span>Pemasukan</span>
                  </div>

                  {/* Pengeluaran */}
                  <div
                    onClick={() => !isViewMode && field.onChange(false)}
                    className={`group flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200
                      ${
                        field.value === false
                          ? "border-red-600 bg-secondary text-red-700 ring-2 ring-red-600 shadow-sm "
                          : "border-muted bg-card hover:border-red-400 hover:bg-secondary "
                      }
                      ${isViewMode ? "pointer-events-none opacity-60" : ""}
                    `}
                  >
                    <BanknoteArrowDownIcon
                      className={`h-8 w-8 transition-transform duration-200 ${
                        field.value === false ? "scale-110" : "group-hover:scale-110"
                      }`}
                    />
                    <span>Pengeluaran</span>
                  </div>
                </div>
              </div>
            )}
          />          
          </CardContent>
    {!isViewMode && (
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
    {isSubmitting ? (
      <span className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Processing...
      </span>
    ) : initialData ? (
      <>
      <Pencil/>Ubah
      </>
    ) : (
      <>
      <Save/>Tambah
      </>
    )}
  </Button>
          </CardFooter>
          )}
        </form>
      </Card>
  );
}