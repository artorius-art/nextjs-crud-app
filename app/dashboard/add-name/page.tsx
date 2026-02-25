'use client'

import { createProfile } from '@/app/action/add-name'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowBigLeft, ArrowLeft, Loader2, LoaderCircle, Save } from 'lucide-react'
import { toast } from 'sonner' // Optional: for nice notifications
import { Toaster } from "@/components/ui/sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation';
export default function ProfileForm({ initialName }: { initialName?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  async function handleSubmit(formData: FormData) {
    setLoading(true)
    let success = false
    
    // setError(null)
    try {
      await createProfile(formData)
      toast.success("Success!", {
          description: "Data berhasil disimpan.",  position: "top-center" 
      })
      success = true
    } catch (err: any) {
      toast.error("Something went wrong.", {
          description: err.message,  position: "top-center" 
      })
      // setError(err.message)
      setLoading(false)
    }
    if (success) {
     
      router.push(`/dashboard/form?type=${type}`)
      // router.refresh()
    }
  }
  async function clientAction(formData: FormData) {
    try {
      await createProfile(formData)
      toast.success("Profile updated!", {
          description: "Nama berhasil diubah",  position: "top-center" 
      })

    } catch (err) {
      toast.error("Error", {
          description: "Something went wrong.",  position: "top-center" 
      })
    }
  }
  return (
    <div className="flex flex-1 flex-col @container/main px-4 lg:px-6 ">
      <Toaster richColors  /> 
      <Card className="relative w-full max-w-sm overflow-hidden mx-auto">
        <form action={handleSubmit} className="space-y-4 max-w-sm">
         <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex flex-col gap-1">
              <CardTitle>Anda belum memiliki Nama</CardTitle>
            </div>
            <Link href="/dashboard">
              <Button className="w-auto" variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
            </Link>
          </CardHeader>
            <CardContent>
              <Label className='mb-2'>Silahkan isi nama anda</Label>
            <Input
              id="display_name"
              name="display_name"
              type="text"
              placeholder="Masukan nama anda"
              required // Browser-level validation
              minLength={2}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Nama yang akan disimpan ketika menabung
            </p>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" className="flex" disabled={loading}>
        {loading ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Mengupdate...
          </>
        ) : (
          <>
           <Save/>
            Update Nama
          </>
        )}
       </Button>
          {/*<Button type="submit" size="lg" className="flex">
            <Save/>
            Update Nama
          </Button> */}
          </CardFooter>
        </form>
        </Card>
    </div>
  )
}