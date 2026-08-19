import Details from "./_components/details";

interface Props {
    params: { lng: string,id:number };
    searchParams: {}
}
  
export default async function Home({ params: { lng, id } }: Props) {

    return (
        <div className="page-wrapper min-h-screen">
            <div className="content">
                <div className="row">
                    <Details id={id} lng={lng} />
                </div>
            </div>
        </div>
    );
}
