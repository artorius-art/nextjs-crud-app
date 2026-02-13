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
     header: () => <div className="text-right">Nominal</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("nominal"))
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount)
 
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "date",
    header: "Tanggal Transaksi",
    filterFn: (row, columnId, filterValue: number[]) => {
        if (!filterValue || filterValue.length === 0) return true;
        const rowDate = new Date(row.getValue(columnId));
        const rowYear = rowDate.getFullYear();
        return filterValue.includes(rowYear);
    },
  },
  {
    accessorKey: "keterangan",
    header: "Keterangan",
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