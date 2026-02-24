import { SkeletonLine } from "@cloudflare/kumo"

export default function Loading(){

    return (
        <div>
            <div className="flex flex-col gap-3 w-64">
                                <SkeletonLine minWidth={40} maxWidth={60} />
            </div>
        </div>
    )
}