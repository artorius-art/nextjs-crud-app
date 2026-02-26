"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TabunganInput, tabunganSchema, type TabunganValues } from "@/lib/schema";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { BanknoteArrowDownIcon, BanknoteArrowUpIcon, Loader2, Pencil, Save, Trash, TrashIcon, UploadCloud } from "lucide-react";
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
import React, { useEffect, useState } from "react";
import Image from "next/image";
export function TabunganForm({
  initialData,
  type,
  mode,
}: {
  initialData?: TabunganValues & { id: number };
  type?: string;
  mode?: string;
}) {
const fileInputRef = React.useRef<HTMLInputElement | null>(null)

const handleClick = () => {
  fileInputRef.current?.click()
}

  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [uploading, setUploading] = React.useState(false)
  const [removeExistingImage, setRemoveExistingImage] = useState(false)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!initialData?.bukti_url) {
      setExistingImageUrl(null)
      return
    }

    const { data: urlData } = supabase.storage
      .from("tabungan-bucket")
      .getPublicUrl(initialData.bukti_url)

    setExistingImageUrl(urlData.publicUrl)
  }, [initialData?.bukti_url])
  const imageToShow = previewUrl
  ? previewUrl
  : removeExistingImage
  ? null
  : existingImageUrl
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate image
    if (!file.type.startsWith("image/")) {
      alert("Silahkan pilih gambar")
      return
    }

    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }
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
  const { data } = supabase.storage
    .from("tabungan-bucket")
    .getPublicUrl(initialData?.bukti_url || "")

const onSubmit = async (data: TabunganValues) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    alert("User not authenticated");
    return;
  }
  setUploading(true)

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


  let finalImagePath = data?.bukti_url || null

  // 1️⃣ If user removed old image
  if (removeExistingImage && data?.bukti_url) {
    await supabase.storage
      .from("tabungan-bucket")
      .remove([data.bukti_url])

    finalImagePath = null
  }
  if (imageFile) {
    if (data?.bukti_url) {
      await supabase.storage
        .from("tabungan-bucket")
        .remove([data.bukti_url])
    }

    const fileExt = imageFile.name.split(".").pop()
    const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from("tabungan-bucket")
      .upload(filePath, imageFile)

    if (uploadError) {
      alert(uploadError.message)
      setUploading(false)
      return
    }

    finalImagePath = filePath
  }

  if (initialData) {
    // UPDATE
    const { error } = await supabase
      .from("tabungan_master")
      .update({
        ...finalData,
        modified_at: new Date().toISOString(),
        modified_by: user.email,
        bukti_url:finalImagePath,
      })
      .eq("id", initialData.id);

    if (error) {
      alert(error.message);
      return;
    }

    toast.success("Horee !!!", {
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
        bukti_url: finalImagePath
      },
    ]);

    if (error) {
      alert(error.message);
      setUploading(false)
      return;
    }

    toast.success("Horee !!!", {
      description: "Tabungan berhasil disimpan.",
      position: "top-center",
    });
  }
    setUploading(false)
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
                  placeholder="Masukan Nominal"
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
            <Textarea readOnly={isViewMode} {...register("keterangan")} placeholder="Masukan Keterangan" />
          </div>

          {/* Pemasukan Toggle (Using Controller for Custom Components) */}
          <Controller
            control={control}
            name="is_pemasukan"
            render={({ field }) => (
              <div className="flex flex-col gap-2 mb-8">
                <label className="text-sm font-medium">Pilih Tipe Transaksi</label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Pemasukan */}
                  <div
                    onClick={() => !isViewMode && field.onChange(true)}
                    className={`group flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200
                      ${
                        field.value === true
                          ? "border-green-600 bg-secondary text-green-600 ring-2 ring-green-600"
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
                          ? " border-destructive bg-secondary text-destructive ring-2 ring-destructive  shadow-sm "
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

        
<div className="space-y-3">
  {imageToShow ? (
    <div className="relative group">
      <Image width={600}
  height={400}
        src={imageToShow}
        alt="Bukti"
        className={`h-auto w-full rounded-xl object-cover border transition ${
          !isViewMode ? "cursor-pointer group-hover:opacity-80" : ""
        }`}
        onClick={!isViewMode ? handleClick : undefined}
      />

      {/* REMOVE BUTTON (EDIT MODE ONLY) */}
      {!isViewMode && (
        <Button
          type="button"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setPreviewUrl(null)
            setImageFile(null)
            setRemoveExistingImage(true)
          }}          
          className="absolute top-2 right-2 bg-destructive/80 hover:bg-destructive text-white"
        >
          <TrashIcon className="h-4 w-4 mr-1" />
          Hapus
        </Button>
      )}
    </div>
  ) : (
    !isViewMode && (
      <div
        onClick={handleClick}
        className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-2 text-center transition-all duration-200 hover:scale-[1.01] hover:border-primary hover:bg-muted/40"
      >
        <UploadCloud className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary" />

        <p className="text-sm font-medium">
          Upload bukti lampiran (opsional)
        </p>

        <p className="text-xs text-muted-foreground">
          PNG, JPG up to 5MB
        </p>
      </div>
    )
  )}

  {/* Hidden Input (only in edit mode) */}
  {!isViewMode && (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className="hidden"
    />
  )}
</div>
          </CardContent>
    {!isViewMode && (
          <CardFooter className="mt-3">
            <Button type="submit" disabled={isSubmitting} size={'lg'} className="w-full">
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