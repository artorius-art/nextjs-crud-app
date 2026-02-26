"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { BabyIcon, Banknote, House, TreePalm } from "lucide-react"

export const description = "An interactive area chart"

const chartConfig = {
  Anak: {
    label: "Anak",
    color: "hsl(var(--destructive))",
  },
  Rumah: {
    label: "Rumah",
    color: "hsl(var(--chart-2))",
  },
  Holiday: {
    label: "Holiday",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

type Props = {
  allData: any[]
}

export function ChartAreaInteractive({ allData }: Props){
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  const [selectedJenis, setSelectedJenis] = React.useState("Anak")
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = React.useState(currentYear)
  const availableYears = React.useMemo(() => {
  const years = new Set(
    allData.map(item => new Date(item.date).getFullYear())
    )
    return Array.from(years).sort((a, b) => b - a)
  }, [allData])
  const monthlyData = React.useMemo(() => {
    
  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  ]

  const result = months.map((month, index) => {
    const filtered = allData.filter(item => {
  const d = new Date(item.date)

  const matchYearMonth =
    d.getFullYear() === selectedYear &&
    d.getMonth() === index

  const matchJenis =
    selectedJenis === "Total"
      ? true
      : item.jenis === selectedJenis

  return matchYearMonth && matchJenis
})

    const pemasukan = filtered
      .filter(item => item.is_pemasukan === true)
      .reduce((sum, item) => sum + item.nominal, 0)

    const pengeluaran = filtered
      .filter(item => item.is_pemasukan === false)
      .reduce((sum, item) => sum + Math.abs(item.nominal), 0)

    return {
      month,
      pemasukan,
      pengeluaran
    }
  })

  return result
}, [allData, selectedYear, selectedJenis])
const pieData = React.useMemo(() => {
  const filtered = allData.filter(item => {
    const d = new Date(item.date)
    return d.getFullYear() === selectedYear
  })

  const grouped: Record<string, number> = {}

  filtered.forEach(item => {
    const jenis = item.jenis
    const nominal = Math.abs(item.nominal)

    if (!grouped[jenis]) {
      grouped[jenis] = 0
    }

    grouped[jenis] += nominal
  })

  const total = Object.values(grouped).reduce((a, b) => a + b, 0)

  return Object.entries(grouped).map(([jenis, value]) => ({
    name: jenis,
    value,
    percent: total > 0 ? ((value / total) * 100).toFixed(1) : 0
  }))
}, [allData, selectedYear])
  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])
  // const filteredData = chartData.filter((item) => {
  //   const date = new Date(item.date)
  //   const referenceDate = new Date("2024-06-30")
  //   let daysToSubtract = 90
  //   if (timeRange === "30d") {
  //     daysToSubtract = 30
  //   } else if (timeRange === "7d") {
  //     daysToSubtract = 7
  //   }
  //   const startDate = new Date(referenceDate)
  //   startDate.setDate(startDate.getDate() - daysToSubtract)
  //   return date >= startDate
  // })
  // console.log(pieData)
const COLORS = ["var(--chart-1)", "var(--chart-3)", "var(--chart-5)"]
  return (
    <>
    <Card className="@container/card">
      <CardHeader>
        {/* <CardTitle>Pemasukan vs Pengeluaran</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Pengeluaran
          </span>
          <span className="@[540px]/card:hidden">Pengeluaran</span>
        </CardDescription> */}
        <CardAction>
          <ToggleGroup 
          className="mb-4"
  multiple={false}
  value={selectedJenis ? [selectedJenis] : []}
  onValueChange={(value) => {
    if (value) setSelectedJenis(value[0] ?? "Anak")
  }}
  variant="outline"
  // className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
>
  <ToggleGroupItem value="Anak"><BabyIcon/>Anak</ToggleGroupItem>
  <ToggleGroupItem value="Rumah"><House/>Rumah</ToggleGroupItem>
  <ToggleGroupItem value="Holiday"><TreePalm/>Holiday</ToggleGroupItem>
  <ToggleGroupItem value="Total"><Banknote/>Total</ToggleGroupItem>
</ToggleGroup>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(Number(value))}
            >
              <SelectTrigger className="w-28" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={monthlyData} accessibilityLayer>
            <defs>
              <linearGradient id="fillPemasukan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1} />
              </linearGradient>

              <linearGradient id="fillPengeluaran" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              // tickFormatter={(value) => {
              //   const date = new Date(value)
              //   return date.toLocaleDateString("en-US", {
              //     month: "short",
              //     day: "numeric",
              //   })
              // }}
            />
            <ChartTooltip
  cursor={false}
  content={({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null

    const pemasukan = payload.find(p => p.dataKey === "pemasukan")?.value ?? 0
    const pengeluaran = payload.find(p => p.dataKey === "pengeluaran")?.value ?? 0

    return (
      <div className="rounded-lg border bg-background p-3 shadow-md text-sm">
        <div className="mb-2 font-semibold">{label}</div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-green-700" />
            <span>Pemasukan</span>
          </div>
          <span className="font-medium text-green-700">
            Rp {Number(pemasukan).toLocaleString("id-ID")}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-destructive" />
            <span>Pengeluaran</span>
          </div>
          <span className="font-medium text-destructive">
            Rp {Number(pengeluaran).toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    )
  }}
/>         
            <Area
              dataKey="pengeluaran"
              type="linear"
              fill="url(#fillPengeluaran)"
              stroke="#ef4444"
              stackId="a"
            />

            <Area
              dataKey="pemasukan"
              type="linear"
              fill="url(#fillPemasukan)"
              stroke="#16a34a"
              stackId="a"
            />          
            </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>


    <Card className="@container/card mt-4">
  <CardHeader>
    <CardTitle>Distribusi Jenis - {selectedYear}</CardTitle>
    <CardDescription>
      Persentase total nominal berdasarkan kategori
    </CardDescription>
  </CardHeader>

  <CardContent className="flex justify-center">
    <ChartContainer
          config={chartConfig}
          className="mx-auto w-full max-w-[250px] aspect-square"
          // className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart >
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
    data={pieData}
    dataKey="value"
    nameKey="name"
    label={({ payload }) => `${payload.percent}%`}
  >
    {pieData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
  </Pie>
  <Legend />
          </PieChart>
        </ChartContainer>
    {/* <PieChart width={400} height={400}>
      
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label={({ name, percent }) => `${name} (${percent}%)`}
      >
        {pieData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip
        formatter={(value: number) =>
          `Rp ${value.toLocaleString("id-ID")}`
        }
          content={({ active, payload, label }) => {
            const val = payload?.find(p => p.dataKey === "value")?.value ?? 0
            return (
              <div className="rounded-lg border bg-background p-3 shadow-md text-sm">
                <div className="mb-2 font-semibold">Rp {val.toLocaleString("id-ID")}</div>
              </div>
            )
          }}
      />

      <Legend />
    </PieChart> */}
  </CardContent>
</Card>
</>
  )
}
