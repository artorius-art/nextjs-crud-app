'use client'

import ShiftingCountdown from "@/components/countdown-timer";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby, Cake, CalendarClock, CalendarDays, TrendingDown, TrendingUp } from "lucide-react";
export function getAgeString(day: number, month: number, year: number): string {
  const startDate = new Date(year, month - 1, day); // month -1 because JS month is 0-11
  const today = new Date();

  let years = today.getFullYear() - startDate.getFullYear();
  let months = today.getMonth() - startDate.getMonth();
  let days = today.getDate() - startDate.getDate();

  if (days < 0) {
    months -= 1;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return `${years} Tahun ${months} Bulan ${days} Hari`;
}
export function ClickCard(){
  alert("Test")
}
export default function Page() {

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card  className="@container/card hover:cursor-pointer dark:border-l-neutral-100 border-l-neutral-400 border-l-4">
        <CardHeader>
          <CardDescription>Papah Adit Ganteng</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <ShiftingCountdown day={5} month={11}/>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <CalendarClock className="size-4" /> {getAgeString(5,11,1996)}
          </div>
          <div className="line-clamp-1 flex gap-2 text-muted-foreground">
            <Cake className="size-4" />5 November 1996
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card  hover:cursor-pointer dark:border-l-primary border-l-primary border-l-4">
        <CardHeader>
          <CardDescription>Mamah Ndi Cantik</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <ShiftingCountdown day={26} month={4}/>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <CalendarClock className="size-4" /> {getAgeString(26,4,2002)}
          </div>
          <div className="line-clamp-1 flex gap-2 text-muted-foreground">
            <Cake className="size-4" />26 April 2002
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card  hover:cursor-pointer dark:border-l-pink-800 border-l-pink-400 border-l-4">
        <CardHeader>
          <CardDescription>Kaka Arin</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <ShiftingCountdown day={28} month={4}/>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <CalendarClock className="size-4" /> {getAgeString(26,4,2022)}
          </div>
          <div className="line-clamp-1 flex gap-2 text-muted-foreground">
            <Cake className="size-4" />28 April 2022
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card  hover:cursor-pointer  dark:border-l-blue-800 border-l-blue-400 border-l-4">
        <CardHeader>
          <CardDescription>Dede Arka</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <ShiftingCountdown day={23} month={3}/>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <CalendarClock className="size-4" /> {getAgeString(23,3,2023)}
          </div>
          <div className="line-clamp-1 flex gap-2 text-muted-foreground">
            <Cake className="size-4" />23 Maret 2023
          </div>
        </CardFooter>
      </Card>
    </div>          
        </div>
      </div>
    </div>
  )

}
