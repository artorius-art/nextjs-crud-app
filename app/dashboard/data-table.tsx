"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Building, Landmark } from "lucide-react"
import { useRouter } from "next/navigation"




interface DataTableProps<TData, TValue, String> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  jenis : string
  nama : string | null
}

export function DataTable<TData, TValue, String>({
  columns,
  data,
  jenis,
  nama
}: DataTableProps<TData, TValue, String>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
    initialState: {
    columnVisibility: {
      date: false, // The key must match the accessorKey "date"
      keterangan: false, // The key must match the accessorKey "date"
      bukti_url: false, // The key must match the accessorKey "date"
    },
  },
  })
    const startYear: number = 2024;
    const currentYear: number = new Date().getFullYear();

    const years: number[] = Array.from(
        { length: currentYear - startYear + 1 }, 
        (_, i) => startYear + i
    );
const months = [
  { label: "Januari", value: "0" }, // Change these to strings
  { label: "Februari", value: "1" },
  { label: "Maret", value: "2" },
  { label: "April", value: "3" },
  { label: "Mei", value: "4" },
  { label: "Juni", value: "5" },
  { label: "Juli", value: "6" },
  { label: "Agustus", value: "7" },
  { label: "September", value: "8" },
  { label: "Oktober", value: "9" },
  { label: "November", value: "10" },
  { label: "Desember", value: "11" },
];    // const anchor1 = useComboboxAnchor()
    // const anchor2 = useComboboxAnchor()
    const anchor1 = React.useRef(null);
    const anchor2 = React.useRef(null);
const lastValueRef = React.useRef<string[]>([]);
const lastChangeTimeRef = React.useRef<number>(0);  
const router = useRouter();
  const handleClick = () => {
    if (nama == null) {
      router.push(`/dashboard/add-name?type=${jenis}`); 
    } else {
      router.push(`/dashboard/form?type=${jenis}`);
    }
  };
return (
    <div>

<div className="flex flex-col sm:flex-row items-start gap-4 py-4 w-full">
  

  <div className="w-full sm:w-1/2 max-w-xs">
    <Combobox
      multiple
      autoHighlight
      items={years}
      defaultValue={[]}// Get current filter values from the table
      value={(table.getColumn("date")?.getFilterValue() as any)?.years ?? []}
      onValueChange={(val) => {
            const currentFilter = (table.getColumn("date")?.getFilterValue() as any) || {};
            table.getColumn("date")?.setFilterValue({ ...currentFilter, years: val });
        }}
    //   value={(table.getColumn("date")?.getFilterValue() as string[]) ?? []}
      // Update the table filter when selection changes
    //   onValueChange={(selectedYears) => {
    //     table.getColumn("date")?.setFilterValue(selectedYears);
    //   }}
    >
      <ComboboxChips ref={anchor1} className="w-full">
        <ComboboxValue>
            {(values) => {
                const yearList = Array.isArray(values) ? values : [];
                return (
                <React.Fragment>
                    {yearList.map((value) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                    ))}
                    <ComboboxChipsInput placeholder="Pilih Tahun" />
                </React.Fragment>
                );
        }}
          {/* {(values) => (
            <React.Fragment>
              {values.map((value: string) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder="Pilih Tahun" />
            </React.Fragment>
          )} */}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor1}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  </div>

  <div className="w-full sm:w-1/2 max-w-xs">
  <Combobox
      multiple
      
      items={months}
      value={(table.getColumn("date")?.getFilterValue() as any)?.months ?? []}
      onValueChange={(val) => {
      
      const now = Date.now();
      const timeSinceLastChange = now - lastChangeTimeRef.current;
      
      // Ignore if this is an empty array being set within 50ms of a non-empty one
      // (likely a double-fire bug, not intentional deselection)
      if (val.length === 0 && lastValueRef.current.length > 0 && timeSinceLastChange < 100) {
          return;
      }
      
      lastValueRef.current = val;
      lastChangeTimeRef.current = now;
      
      const currentFilter = (table.getColumn("date")?.getFilterValue() as any) || {};
      table.getColumn("date")?.setFilterValue({ 
          ...currentFilter,
          months: val
      });
  }}
      // onValueChange={(val) => {
      //     const currentFilter = (table.getColumn("date")?.getFilterValue() as any) || {};
      //     table.getColumn("date")?.setFilterValue({ 
      //         ...currentFilter, 
      //         months: val 
      //     });
      // }}
  >
      <ComboboxChips ref={anchor2} className="w-full">
          <ComboboxValue>
              {(values) => {
                  const monthList = Array.isArray(values) ? values : [];
                  return (
                      <>
                          {monthList.map((v) => (
                              <ComboboxChip key={v}>
                                  {months.find((m) => m.value === v)?.label}
                              </ComboboxChip>
                          ))}
                          <ComboboxChipsInput placeholder="Pilih Bulan" />
                      </>
                  );
              }}
          </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor2}>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
              {(item) => (
                  <ComboboxItem key={item.value} value={item.value}>
                      {item.label}
                  </ComboboxItem>
              )}
          </ComboboxList>
      </ComboboxContent>
  </Combobox>  
  </div>
  <div className="w-full sm:w-1/2 max-w-xs float-right">
  <Button size='lg' variant='default' onClick={handleClick}><Landmark/>Transaksi Tabungan {jenis}</Button>
  </div>
  </div>

  <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>

    <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

    </div>
    
  )
}