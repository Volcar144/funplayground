"use client"

import { Button, Tooltip, TooltipProvider, Text, Banner, Breadcrumbs, Tabs, Meter, Toast, useKumoToastManager} from "@cloudflare/kumo"
import { InfoIcon, PlusIcon, HouseIcon, ClockCounterClockwiseIcon } from "@phosphor-icons/react"
import { useState } from "react"


export default function OtherPage() {
    const [activeTab, setActiveTab] = useState("tab1");
    const [meterAmount, setMeterAmount] = useState(0);

    const toastManager = useKumoToastManager();

    function increaseMeter(){
        if(meterAmount <= 100){
            setMeterAmount(meterAmount + 1);
        } else {
            toastManager.add({
                title:"Error!",
                description:"Meter already at 100%!",
                variant:"error"
            })
        }
    }

    function resetMeter(){
        setMeterAmount(0);
    }

    function returnContent(){
        if(activeTab == "tab1"){
            return (
                <>
                    <p>Nice to see you</p>
                    <div className="flex gap-5">
                        <Tooltip content="Add" asChild>
                            <Button icon={<PlusIcon />} ></Button> 
                        </Tooltip> 
                    </div>
                </>
            )
        } else if(activeTab == "tab2"){
            return (
                <>
                    <p>This is extra content</p>
                </>
            )
        } else if(activeTab == "tab3"){
            return (
                <>
                    <p>This is a meter, press the button to fill it!</p>
                    <Meter
                    value={meterAmount}
                    label="Clicked label"
                    ></Meter>
                    <div className="flex gap-5">
                        <Button variant="primary" icon={<PlusIcon />} onClick={increaseMeter}>Increase</Button>
                        <Button variant="destructive" icon={<ClockCounterClockwiseIcon />} onClick={resetMeter}>Reset Meter</Button>
                    </div>
                </>
            )
        }
    }

    return (
        <div className="flex justify-center bg-zinc-75 font sans dark:black min-h-screen items-center">
            <TooltipProvider>
                <main className="flex max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start outline-black">
                    <div className="flex flex-col gap-6 sm:text-left">
                        <Breadcrumbs>
                            <Breadcrumbs.Link icon={<HouseIcon size={16} />} href="/">
                                Home
                            </Breadcrumbs.Link>
                            <Breadcrumbs.Separator />
                            <Breadcrumbs.Link href="/other">
                                Other
                            </Breadcrumbs.Link>
                        </Breadcrumbs>
                    </div>
                    <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                        <h1 className="text-48">Welcome to the Other Page!</h1>
                        <Tabs
                            tabs={[
                                {value: "tab1", label: "Tab 1"},
                                {value: "tab2", label:"Tab 2"},
                                {value: "tab3", label:"Meter"}
                            ]}
                            value={activeTab}
                            onValueChange={setActiveTab}
                        ></Tabs>
                        {returnContent()}
                    </div>
                </main>
            </TooltipProvider>
        </div>
    )
}