import FingerprintJS, { GetResult } from '@fingerprintjs/fingerprintjs'

export async function getStats(){
    const fpPromise = FingerprintJS.load({
        monitoring: false
    })

    async () =>{
        const fp = await fpPromise
        const deviceStats = await fp.get()
        return deviceStats
    }

}

export async function getId() {
        const fpPromise = FingerprintJS.load({
        monitoring: false
    })

    async () =>{
        const fp = await fpPromise
        const deviceStats = await fp.get()
        return deviceStats.visitorId;
    }
}

export function parseId(fpGetResult: GetResult){
    if(fpGetResult !== undefined){
        return fpGetResult.visitorId;
    }
}