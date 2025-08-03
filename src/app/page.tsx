
import Link from "next/link";
import { UploadButton } from "~/utils/uploadthing";
import { UploadDialog } from "./_components/upload-dialog";
import { get } from "http";
import { getMyImages } from "~/server/queries";
import { ImageModal } from "./_components/image-modal";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const dynamic = "force-dynamic"; // This page should always be dynamic

async function Images() {

  // const mockUrls = ["https://assets-prd.ignimgs.com/2022/08/17/top25animecharacters-blogroll-1660777571580.jpg", 
  //   "https://uchi.imgix.net/properties/anime2.png?crop=focalpoint&domain=uchi.imgix.net&fit=crop&fm=pjpg&fp-x=0.5&fp-y=0.5&h=558&ixlib=php-3.3.1&q=82&usm=20&w=992",
  //   "https://ifd5gykznt.ufs.sh/f/sXk2voahxwQCJqBGeyvqU29mvVFGIkMTuLAdQb0rEipscy3P", "https://ifd5gykznt.ufs.sh/f/sXk2voahxwQCnqxK6H6b58YjLJbUeMudk43VoPDGl6mh9Cxa",
  // ];

  // const images = mockUrls.map((url, index) => ({
  //   id: index + 1,
  //   url,
  // }));
  const images = await getMyImages();
  return(
    <div>
      <div className="flex justify-end p-4">
        <UploadDialog/>
      </div>
      
    <div className="flex flex-wrap justify-center gap-6 p-4">
      {images.map((image) => (
          <div key={image.id} className="flex w-100 flex-col">
            <ImageModal image={image}>
              <div className="relative aspect-video bg-zinc-900">
              <img 
                src={image.imageUrl} 
                alt={`Image ${image.id}`} 
                className="h-full w-full object-contain object-top"
                />
              </div>
            </ImageModal>
              <div className="text-center">{image.ImageName || image.filename}</div>
          </div>
          
      ))}
    </div>
    </div>
  );
}

export default async function HomePage() {
  return (
    <main className="">
      <SignedOut>
        <div className="h-full w-full text-center-2xl">
          Please Sign In Above to Continue!
          
        </div>
      </SignedOut>
      <SignedIn>
        <div className="h-full w-full text-center text-2xl">
          Welcome Back!!
          <Images/>
        </div>
      </SignedIn>
    </main>
  );
}