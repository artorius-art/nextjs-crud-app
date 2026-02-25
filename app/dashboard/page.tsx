export const dynamic = "force-dynamic";
export const revalidate = 0;
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
// import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { columns, Payment, TabunganMaster } from "./columns"
import { DataTable } from "./data-table"
import data from "./data.json"
// import { supabase } from "@/lib/supabase"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Baby, ChartBar, House, TreePalm } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from '@/utils/supabase/server'
// async function getData(): Promise<TabunganMaster[]> {
//   try {
//     const { data: result, error } = await supabase
//       .from('tabungan_master')
//       .select('*')
//       .eq('is_active', true)
//       .order('date', { ascending: false });

    
//     if (error || !result) {
//       console.error('Supabase Error:', error);
//       return []; // Return empty list so .map() doesn't crash in your UI
//     }

//     return result as TabunganMaster[];
    
//   } catch (err) {
//     console.error('Unexpected Error:', err);
//     return []; 
//   }
// }
async function getData() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tabungan_master')
    .select('*')
    .eq('is_active', true)
    .order('date', { ascending: false })

  if (error || !data) return []
  return data
}

export default async function Page() {
  const supabaserver = await createClient();

  const {
    data: { user },
  } = await supabaserver.auth.getUser();

  let display_name: string | null = null;

  if (user) {
    const { data } = await supabaserver
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single();
      if(data != null) display_name = data?.display_name ?? "";
  }
  
  const data = await getData();
  // const data = await getData()
  // const nama = await getUserName()
  // const display_name = nama != null ? nama?.display_name : null;
  return (
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards  allData={data}/>
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
                    <DataTable columns={columns} data={data.filter(s => s.jenis === 'Anak')} jenis={'Anak'} nama={display_name} />
                  </div>
                  

                </TabsContent>
                <TabsContent value="Rumah">
                  <div className="">
                    <DataTable columns={columns} data={data.filter(s => s.jenis === 'Rumah')}  jenis={'Rumah'}nama={display_name}/>
                  </div>

                </TabsContent>
                <TabsContent value="Holiday">
                  <div className="">
                    <DataTable columns={columns} data={data.filter(s => s.jenis === 'Holiday')}  jenis={'Holiday'}nama={display_name}/>
                  </div>

                </TabsContent>
                <TabsContent value="Statistik">
                  <ChartAreaInteractive allData={data} />

                </TabsContent>
              </Tabs>
              
              {/* <DataTable data={data} /> */}
            </div>
          </div>
        </div>
  )
}
