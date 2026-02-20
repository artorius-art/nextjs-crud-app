import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
// import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { columns, Payment, TabunganMaster } from "./columns"
import { DataTable } from "./data-table"
import data from "./data.json"
import { supabase } from "@/lib/supabase"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Baby, ChartBar, House, TreePalm } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
async function getDataDummy(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ]
}
async function getData(): Promise<TabunganMaster[]> {
  try {
    const { data: result, error } = await supabase
      .from('tabungan_master')
      .select('*')
      .eq('is_active', true)
      .order('date', { ascending: false });

    
    if (error || !result) {
      console.error('Supabase Error:', error);
      return []; // Return empty list so .map() doesn't crash in your UI
    }

    return result as TabunganMaster[];
    
  } catch (err) {
    console.error('Unexpected Error:', err);
    return []; 
  }
}
export default async function Page() {
  const data = await getData()
  return (
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              {/* <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div> */}
              <Tabs defaultValue="Anak" className="px-4 lg:px-6 w-full">
                <TabsList>
                  <TabsTrigger value="Anak"><Baby />Anak</TabsTrigger>
                  <TabsTrigger value="Rumah"><House />Rumah</TabsTrigger>
                  <TabsTrigger value="Holiday"><TreePalm />Holiday</TabsTrigger>
                  <TabsTrigger value="Statistik"><ChartBar/>Statistik</TabsTrigger>
                </TabsList>
                <TabsContent value="Anak">
                <div className="">
                    <DataTable columns={columns} data={data.filter(s => s.jenis === 'anak')} />
                  </div>
                  

                </TabsContent>
                <TabsContent value="Rumah">
                  <div className="">
                    <DataTable columns={columns} data={data.filter(s => s.jenis === 'rumah')} />
                  </div>

                </TabsContent>
                <TabsContent value="Holiday">
                  <div className="">
                    <DataTable columns={columns} data={data.filter(s => s.jenis === 'holiday')} />
                  </div>

                </TabsContent>
                <TabsContent value="Statistik">
                  <ChartAreaInteractive />

                </TabsContent>
              </Tabs>
              
              {/* <DataTable data={data} /> */}
            </div>
          </div>
        </div>
  )
}
