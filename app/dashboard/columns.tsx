"use client"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
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
}
export const columns: ColumnDef<TabunganMaster>[] = [
  {
    accessorKey: "nominal",
     header: () => <div className="">Nominal</div>,
        cell: ({ row }) => {
        const amount = parseFloat(row.getValue("nominal"))
        const rowDate = new Date(row.getValue("date"));
        const rowKeterangan = String(row.getValue("keterangan") ?? "");
        const formatted = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0, 
            minimumFractionDigits: 0, 
        }).format(amount)

        return (
            <div>
                <div className="font-bold text-xl">{formatted}</div>
                <div className="text-muted-foreground text-sm">{rowDate.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                })}
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
    accessorKey: "created_by_name",
    header: "Dibuat oleh",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const tabungan = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger  className={cn(
      buttonVariants({ variant: "ghost", size: "icon",  }),
      "relative", "h-8 w-8 p-0" // Add any extra positioning
      
    )}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup> {/* Add this wrapper */}
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(tabungan.id.toString())}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuGroup> {/* Add this wrapper */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
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