import { ApplicationReqsList } from "./_components/list";
import { Suspense } from "react";

export default async function Home({ params: { lng } }: any) {
  
    return (
        <div className="page-wrapper min-h-screen">
            <div className="content">
                <div className="row">
                    <Suspense>
                        <ApplicationReqsList lng={lng} />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
