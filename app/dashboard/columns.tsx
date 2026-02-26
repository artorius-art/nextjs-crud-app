"use client"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { BanknoteArrowDown, BanknoteArrowUp, Eye, File, FileImageIcon, MoreHorizontal, Pencil, Trash2, Trash2Icon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu"
import { buttonVariants } from "@/components/ui/button"
import { number } from "zod"
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import React from "react"
import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog"
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge"

function RowActions({ tabungan }: { tabungan: TabunganMaster }) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("tabungan_master")
      .update({ is_active: false })
      .eq("id", tabungan.id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setOpen(false);
    router.refresh(); // 🔥 refresh table
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            buttonVariants({ variant: "secondary", size: "icon" }),
            "h-8 w-8 p-0"
          )}
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
        <DropdownMenuGroup>
        <DropdownMenuLabel>Aksi</DropdownMenuLabel>

    <DropdownMenuItem
      onClick={() =>
        router.push(`/dashboard/form/${tabungan.id}?mode=edit`)
      }
    >
      <Pencil className="mr-2 h-4 w-4" /> Ubah
    </DropdownMenuItem>

    <DropdownMenuItem
      onClick={() =>
        router.push(`/dashboard/form/${tabungan.id}?mode=view`)
      }
    >
      <Eye className="mr-2 h-4 w-4" /> Lihat
    </DropdownMenuItem>

    <DropdownMenuSeparator />

    <DropdownMenuItem
      onClick={() => setOpen(true)}
      variant="destructive"
    >
      <Trash2 className="mr-2 h-4 w-4" /> Hapus
    </DropdownMenuItem>
  </DropdownMenuGroup>
</DropdownMenuContent>      </DropdownMenu>

      {/* ALERT DIALOG */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
            <AlertDialogTitle>Hapus Tabungan?</AlertDialogTitle>
            <AlertDialogDescription>
              Transaksi akan dihapus dan tidak bisa dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>
              <X/>Batal
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              variant="destructive"
            >
              {loading ? "Menghapus..." : <><Trash2/>Hapus</>}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}
export type TabunganMaster = {
  id: number
  created_at: string // or Date, depending on your transformer
  jenis: string
  nominal: number
  keterangan: string | null
  date: string // ISO date string (YYYY-MM-DD)
  is_active: boolean
  created_by: string | null
  is_pemasukan: boolean
  created_by_name: string | null
  bukti_url: string | null
}
export const columns: ColumnDef<TabunganMaster>[] = [
  {
    accessorKey: "nominal",
     header: () => <div className="">Nominal</div>,
        cell: ({ row }) => {
        const amount = parseFloat(row.getValue("nominal"))
        const rowDate = new Date(row.getValue("date"));
        const rowKeterangan = String(row.getValue("keterangan") ?? "");
        const rowUrl = String(row.getValue("bukti_url") ?? "");
        const isHasAtt = rowUrl != "";
        const formatted = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0, 
            minimumFractionDigits: 0, 
        }).format(amount)
        const isPemasukan = amount > 0;
        return (
            <div>
                <Badge
                  variant={
                    isPemasukan ? "default" : "destructive"}
                  className = {
                    isPemasukan ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 py-3" : "py-3"}
                  >
                  <div className="font-bold text-xl"> {formatted}
                   
                    
                    </div>
                </Badge>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">{rowDate.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                })}  {isHasAtt && <FileImageIcon className="text-primary" size={16} />}
                </div>
                
                {rowKeterangan ? (
                  <blockquote className="mt-6 border-l-2 pl-6 italic">
                    &quot;{rowKeterangan}&quot;
                  </blockquote>
                ) : null}
            </div>
            
        )
        
        },
  },
  {
    accessorKey: "date",
    header: "Tanggal Transaksi",
    filterFn: (row, columnId, filterValue: { years?: number[], months?: string[] }) => {
        const rowDate = new Date(row.getValue(columnId));
        const rowYear = rowDate.getFullYear();
        const rowMonth = rowDate.getMonth(); 
        const hasYearMatch = !filterValue.years?.length || filterValue.years.includes(rowYear);
        const numberArray: number[] = filterValue.months?.map(Number) || [];
        const hasMonthMatch = !filterValue.months?.length || numberArray.includes(rowMonth);
        return hasYearMatch && hasMonthMatch;
    },
    
  },
  {
    accessorKey: "keterangan",
    header: "Keterangan",
  },
  {
    accessorKey: "bukti_url",
    header: "Attachment",
  },
  {
    accessorKey: "created_by_name",
    header: "Dibuat oleh",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <RowActions tabungan={row.original} />;
    //   const tabungan = row.original
    //   const router = useRouter();

    //   return (
    //     <DropdownMenu>
    //       <DropdownMenuTrigger  className={cn(
    //   buttonVariants({ variant: "secondary", size: "icon",  }),
    //   "relative", "h-8 w-8 p-0" // Add any extra positioning
      
    // )}>
    //           <span className="sr-only">Open menu</span>
    //           <MoreHorizontal className="h-4 w-4" />
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent align="end">
    //         <DropdownMenuGroup> {/* Add this wrapper */}
    //         <DropdownMenuLabel>Aksi</DropdownMenuLabel>
    //         <DropdownMenuItem
    //           onClick={() => router.push(`/dashboard/form/${tabungan.id}?mode=edit`)}
    //         >
    //           <Pencil className="mr-2 h-4 w-4" /> Ubah
    //         </DropdownMenuItem>

    //         <DropdownMenuItem
    //           onClick={() => router.push(`/dashboard/form/${tabungan.id}?mode=view`)}
    //         >
    //           <Eye className="mr-2 h-4 w-4" /> Lihat
    //         </DropdownMenuItem>
    //         <DropdownMenuSeparator />
    // <AlertDialog>
    //   <AlertDialogContent size="sm">
    //     <AlertDialogHeader>
    //       <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
    //         <Trash2Icon />
    //       </AlertDialogMedia>
    //       <AlertDialogTitle>Hapus Tabungan?</AlertDialogTitle>
    //       <AlertDialogDescription>
    //         Transaksi tabungan akan dihapus dan tidak bisa dikembalikan
    //       </AlertDialogDescription>
    //     </AlertDialogHeader>
    //     <AlertDialogFooter>
    //       <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
    //       <AlertDialogAction variant="destructive">Hapus</AlertDialogAction>
    //     </AlertDialogFooter>
    //   </AlertDialogContent>
    // </AlertDialog>

    //         <DropdownMenuItem 
    //         onClick={() => alert(tabungan.id.toString())}
    //         variant="destructive"
    //         >
    //           <Trash2/>Hapus
    //         </DropdownMenuItem>
    //         </DropdownMenuGroup> {/* Add this wrapper */}
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   )
    },
  },
]
export const columnsFake: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
]