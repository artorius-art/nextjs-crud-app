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
import { TrendingUpIcon, TrendingDownIcon, Baby, BabyIcon, House, TreePalm, Banknote, MilestoneIcon } from "lucide-react"
import { StarsBackground } from "./animate-ui/components/backgrounds/stars"
// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabase"
type Props = {
  allData: any[]
}

export function SectionCards({ allData = [] }: Props) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const lastMonthDate = new Date(currentYear, currentMonth - 1)
  const lastMonth = lastMonthDate.getMonth()
  const lastMonthYear = lastMonthDate.getFullYear()
  const getMonthlyDiff = (jenis?: string | null) => {
    const calculateTotal = (month: number, year: number) => {
      return allData
        .filter(item => {
          const d = new Date(item.date);
          const matchesDate = d.getMonth() === month && d.getFullYear() === year;
          const matchesJenis = !jenis || item.jenis === jenis;
          
          return matchesDate && matchesJenis;
        })
        .reduce((sum, item) => sum + item.nominal, 0);
    };

    const currentTotal = calculateTotal(currentMonth, currentYear);
    const lastTotal = calculateTotal(lastMonth, lastMonthYear);

    return currentTotal - lastTotal;
  };
const diffAnak = getMonthlyDiff("Anak")
const diffRumah = getMonthlyDiff("Rumah")
const diffHoli = getMonthlyDiff("Holiday")
const diffTot = getMonthlyDiff(null)
const isUp = diffAnak > 0 
const isDown = diffAnak < 0 
const isUpR = diffRumah > 0 
const isDownR = diffRumah < 0 
const isUpH = diffHoli > 0 
const isDownH = diffHoli < 0 
const isUpT = diffTot > 0 
const isDownT = diffTot < 0 

  // const [allData, setAllData] = useState<any[]>([])
  // const fetchAllData = async () => {
  //   try {
  //     const { data: result, error } = await supabase
  //       .from('tabungan_master')
  //       .select('*')
  //       .eq('is_active', true)
  //       .order('date', { ascending: false })

  //     if (error) {
  //       console.error('Error fetching all data:', error)
  //     } else {
  //       // console.log(result)
  //       setAllData(result || [])
  //     }
  //   } catch (error) {
  //     console.error('Error:', error)
  //   }
  // }
  // useEffect(() => {
  //   fetchAllData()
  // }, [])
  return (
    // <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
    <div className="relative w-full scrollbar-hide">
  {/* Scroll Container */}
  <div

  className="
     snap-container
    scrollbar-hide
    flex gap-4 overflow-x-auto snap-x snap-mandatory 
    px-4 scroll-pl-4
    pt-2 pb-2
    md:mx-4 md:px-0
    md:grid md:grid-cols-4
    md:overflow-visible md:snap-none
  "
  style={{ scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
  // className="
  //   snap-container
  //   -mx-4 first:ml-4 last:mr-4  scrollbar-hide
  //   flex gap-4 overflow-x-auto snap-x snap-mandatory 
  //   pt-2 pb-2
  //   md:mx-0 md:px-0
  //   md:grid md:grid-cols-4
  //   md:overflow-visible md:snap-none
  // "
>
<Card className="min-w-[85%] snap-start md:min-w-0">
      {/* <Card className="@container/card"> */}
        <CardHeader>
          <CardDescription>Tabungan Anak</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp {allData.filter(item => item.jenis === 'Anak').reduce((sum, item) => sum + item.nominal, 0).toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
              <Baby size={30}
              />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex items-center gap-2 font-medium">
            Tabungan bulan ini
              {isUp  ? (
              <>
                  <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                    <TrendingUpIcon/>Rp {Math.abs(diffAnak).toLocaleString("id-ID")}
                </Badge>
              </>
              ) : isDown ? (
                              <>
                  <Badge variant="destructive">
                    <TrendingDownIcon/>Rp {Math.abs(diffAnak).toLocaleString("id-ID")}
                </Badge>
              </>
              ) : (<>
                  <Badge>
                    <MilestoneIcon/>Tetap
                </Badge>
              </>)}
              {/* <span className={isUp ? "text-green-600" : "text-red-600"}>
                {isUp ? "Naik" : "Turun"} Rp{" "}
                {Math.abs(diffAnak).toLocaleString("id-ID")}
              </span> */}
            </div>

            <span className="text-muted-foreground">
              dibanding bulan lalu
            </span>        
          </CardFooter>
      </Card>
<Card className="min-w-[85%] snap-center md:min-w-0">
        <CardHeader>
          <CardDescription>Tabungan Rumah</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp {allData.filter(item => item.jenis === 'Rumah').reduce((sum, item) => sum + item.nominal, 0).toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
            <House size={30}
              />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex items-center gap-2 font-medium">
            Tabungan bulan ini
              {isUpR  ? (
              <>
                  <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                    <TrendingUpIcon/>Rp {Math.abs(diffRumah).toLocaleString("id-ID")}
                </Badge>
              </>
              ) : isDownR ? (
                              <>
                  <Badge variant="destructive">
                    <TrendingDownIcon/>Rp {Math.abs(diffRumah).toLocaleString("id-ID")}
                </Badge>
              </>
              ) : (<>
                  <Badge>
                    <MilestoneIcon/>Tetap
                </Badge>
              </>)}
              {/* <span className={isUp ? "text-green-600" : "text-red-600"}>
                {isUp ? "Naik" : "Turun"} Rp{" "}
                {Math.abs(diffAnak).toLocaleString("id-ID")}
              </span> */}
            </div>

            <span className="text-muted-foreground">
              dibanding bulan lalu
            </span>        
          </CardFooter>
      </Card>
<Card className="min-w-[85%] snap-center md:min-w-0">
        <CardHeader>
          <CardDescription>Tabungan Holiday</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp {allData.filter(item => item.jenis === 'Holiday').reduce((sum, item) => sum + item.nominal, 0).toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
            <TreePalm size={30}
              />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex items-center gap-2 font-medium">
            Tabungan bulan ini
              {isUpH  ? (
              <>
                  <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                    <TrendingUpIcon/>Rp {Math.abs(diffHoli).toLocaleString("id-ID")}
                </Badge>
              </>
              ) : isDownH ? (
                              <>
                  <Badge variant="destructive">
                    <TrendingDownIcon/>Rp {Math.abs(diffHoli).toLocaleString("id-ID")}
                </Badge>
              </>
              ) : (<>
                  <Badge>
                    <MilestoneIcon/>Tetap
                </Badge>
              </>)}
              {/* <span className={isUp ? "text-green-600" : "text-red-600"}>
                {isUp ? "Naik" : "Turun"} Rp{" "}
                {Math.abs(diffAnak).toLocaleString("id-ID")}
              </span> */}
            </div>

            <span className="text-muted-foreground">
              dibanding bulan lalu
            </span>        
          </CardFooter>
      </Card>
<Card className="min-w-[85%] snap-end md:min-w-0 ">
        <CardHeader>
          <CardDescription>Total Tabungan</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp {allData.reduce((sum, item) => sum + item.nominal, 0).toLocaleString('id-ID')}
          </CardTitle>
          <CardAction>
            <Banknote size={30}
              />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex items-center gap-2 font-medium">
            Tabungan bulan ini
              {isUpT  ? (
              <>
                  <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                    <TrendingUpIcon/>Rp {Math.abs(diffTot).toLocaleString("id-ID")}
                </Badge>
              </>
              ) : isDownT ? (
                              <>
                  <Badge variant="destructive">
                    <TrendingDownIcon/>Rp {Math.abs(diffTot).toLocaleString("id-ID")}
                </Badge>
              </>
              ) : (<>
                  <Badge>
                    <MilestoneIcon/>Tetap
                </Badge>
              </>)}
              {/* <span className={isUp ? "text-green-600" : "text-red-600"}>
                {isUp ? "Naik" : "Turun"} Rp{" "}
                {Math.abs(diffAnak).toLocaleString("id-ID")}
              </span> */}
            </div>

            <span className="text-muted-foreground">
              dibanding bulan lalu
            </span>        
          </CardFooter>
      </Card>
    </div>
    
    </div>
  )
}
