import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { UploadButton } from "~/utils/uploadthing";
import { UploadDialog } from "./_components/upload-dialog";

async function Images() {

  const mockUrls = ["https://assets-prd.ignimgs.com/2022/08/17/top25animecharacters-blogroll-1660777571580.jpg", 
    "https://uchi.imgix.net/properties/anime2.png?crop=focalpoint&domain=uchi.imgix.net&fit=crop&fm=pjpg&fp-x=0.5&fp-y=0.5&h=558&ixlib=php-3.3.1&q=82&usm=20&w=992",
    
  ];

  const images = mockUrls.map((url, index) => ({
    id: index + 1,
    url,
  }));
  
  return(
    <div>
    <div className="flex justify-end p-4">
        <UploadDialog/>
      </div> 
      
    <div className="flex flex-wrap justify-center gap-6 p-4">
      {images.map((image) => (
          <div key={image.id} className="flex w-100 flex-col">
              <div className="relative aspect-video bg-zinc-900">
                <img 
                  src={image.url} 
                  alt={`Image ${image.id}`} 
                  className="h-full w-full object-contain object-top"
                />
              </div>
              <div className="text-center">{image.id}</div>
          </div>
          
      ))}
    </div>
    </div>
  );
}
  
export default function HomePage() {
  return (
    <main className="bg-grey">
      <SignedOut>
        <div className="hfull w-full text-center text-2xl">
          Please sign in to continue.
        </div>
      </SignedOut>
      <SignedIn>
        <div className="hfull w-full text-center text-2xl">
          Welcome to Cloud!
           <Images/>
        </div>
      </SignedIn>

    </main>
  );
}
