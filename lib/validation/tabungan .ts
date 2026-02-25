// lib/validations/tabungan.ts
import * as z from "zod"

export const tabunganSchema = z.object({
  jenis: z.string().min(2, "Jenis must be at least 2 characters"),
  nominal: z.coerce.number().min(1, "Nominal must be greater than 0"),
  keterangan: z.string().optional().nullable(), // nullable matches your DB
  date: z.string().min(1, "Date is required"),
  is_pemasukan: z.boolean().default(true),
})

export type TabunganFormValues = z.infer<typeof tabunganSchema>