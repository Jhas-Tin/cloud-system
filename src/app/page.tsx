
import Link from "next/link";
import { UploadButton } from "~/utils/uploadthing";
import { UploadDialog } from "./_components/upload-dialog";
import { get } from "http";
import { getMyImages } from "~/server/queries";
import { ImageModal } from "./_components/image-modal";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

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
        <section className="relative h-screen w-full bg-gray-900 text-white flex items-center justify-center">
          {/* Background image */}
          <img
            src="https://png.pngtree.com/thumb_back/fh260/background/20230415/pngtree-website-technology-line-dark-background-image_2344719.jpg" // replace with your own image
            alt="Gallery Background"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />

          {/* Overlay content */}
          <div className="relative z-10 text-center px-4 md:px-0">
            <p className="tracking-widest uppercase text-sm md:text-base text-gray-200">
              Welcome to
            </p>
            <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-wide text-white">
              Cloud Art Gallery
            </h1>
            <p className="mt-4 text-lg md:text-2xl font-light text-gray-100">
              Discover and explore amazing artworks
            </p>

            {/* Sign-in button */}
            <div className="mt-8 inline-block">
              <SignInButton>
                <span className="px-8 py-3 bg-blue-600 text-white rounded-md font-semibold shadow-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  Sign In to Explore
                </span>
              </SignInButton>
            </div>
          </div>
        </section>
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen w-full flex flex-col items-center px-2 py-4">
          <div className="text-2xl font-semibold mb-2 text-center">Welcome Back to Cloud Storage!</div>
          <Images/>
        </div>
      </SignedIn>
    </main>
  );
}