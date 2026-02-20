"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon, Baby, BabyIcon, House, TreePalm, Banknote } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export function SectionCards() {

  const [allData, setAllData] = useState<any[]>([])
  const fetchAllData = async () => {
    try {
      const { data: result, error } = await supabase
        .from('tabungan_master')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: false })

      if (error) {
        console.error('Error fetching all data:', error)
      } else {
        // console.log(result)
        setAllData(result || [])
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  useEffect(() => {
    fetchAllData()
  }, [])
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tabungan Anak</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp. {allData.filter(item => item.jenis === 'anak').reduce((sum, item) => sum + item.nominal, 0).toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
              <Baby size={30}
              />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tabungan Rumah</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp. {allData.filter(item => item.jenis === 'rumah').reduce((sum, item) => sum + item.nominal, 0).toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
            <House size={30}
              />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period{" "}
            <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tabungan Holiday</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp. {allData.filter(item => item.jenis === 'holiday').reduce((sum, item) => sum + item.nominal, 0).toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
            <TreePalm size={30}
              />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Tabungan</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp. {allData.reduce((sum, item) => sum + item.nominal, 0).toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
            <Banknote size={30}
              />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}
