// lib/schema.ts
import * as z from "zod";

export const tabunganSchema = z.object({
  jenis: z.string().min(1, "Jenis is required"),
  // Simplified number coercion
 nominal: z.coerce
    .number({
      error: "Nominal harus diisi",
    })
    .positive("Nominal harus diisi"),
    // .min(1, { message: "Nominal must be greater than 0" })
  // .nullable().optional(),
  keterangan: z.string().nullable().optional(),
  date: z.string().min(1, "Tanggal harus diisi"),
  is_pemasukan: z.boolean().default(true),
  bukti_url: z.string().nullable().optional(),
});

export type TabunganValues = z.infer<typeof tabunganSchema>;
export type TabunganInput = z.input<typeof tabunganSchema>;