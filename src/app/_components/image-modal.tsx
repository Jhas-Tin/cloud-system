"use client";

import { useUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { DeleteButton } from "./delete-button";
import { EditButton } from "./edit-button";

interface ImageModalProps {
  image: {
    id: number;
    filename: string | null;
    ImageName: string | null;
    imageUrl: string;
    userId: string;
    createdAt: Date;
  };
  children: React.ReactNode;
}

export function ImageModal({ image, children }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
//   const {user} = useUser();
const [uploaderInfo, setUploaderInfo] = useState<{fullName: string} | null>(null);
const [isLoading, setIsLoading] = useState(false);
const {user} = useUser();

    useEffect(() => {
        if (isOpen && !uploaderInfo) {
            setIsLoading(true);
            fetch(`/api/user/${image.userId}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        throw new Error(data.error);
                    }
                    setUploaderInfo({
                        fullName: data.fullName,
                    });
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching uploader info:", error);
                    setUploaderInfo({fullName: "Unknown User"});
                setIsLoading(false);
            });
        }
    }, [isOpen, uploaderInfo, image.userId]);
    
  return (
    <div>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="min-h-[90vh] min-w-[90vw] overflow-hidden p-0">
          <div className="flex h-full w-full flex-col md:flex-row">
            <div className="flex flex-1 items-center justify-center p-4 bg-black">
              <img
                src={image.imageUrl}
                alt={String(image.id)}
                className="object-contain rounded-lg shadow-lg border border-gray-700"
                style={{
                  maxHeight: '75vh',
                  maxWidth: '75vw',
                  width: 'auto',
                  height: 'auto',
                  minHeight: 0,
                  minWidth: 0,
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </div>
            <div className="flex w-full flex-col md:w-80 bg-light-gray">
              <DialogHeader className="border-b p-4">
                <DialogTitle className="text-center">{image.ImageName || image.filename}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col p-4 space-y-4 flex-1">
                <div className="flex flex-col">
                    <span>Uploaded by:</span>
                    <span className="text-white-900">{isLoading ? "Loading..." : uploaderInfo?.fullName}</span>
                    <span className="text-white-900">Created at: {new Date(image.createdAt).toLocaleString()}</span>
                </div>
                <div className="mt-4">
                    <DeleteButton idAsNumber={image.id}/>
                    <EditButton idAsNumber={image.id}/>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
  // <div>
  //     <div onClick={() => setIsOpen(true)} className="cursor-pointer">
  //       {children}
  //     </div>
  //     <Dialog open={isOpen} onOpenChange={setIsOpen}>
  //       <DialogContent className="min-h-[90vh] min-w-[90vw] overflow-hidden p-0">
  //         <div className="flex h-full w-full flex-col md:flex-row">
  //           <div className="flex flex-1 items-center justify-center p-4 bg-black">
  //             <img
  //               src={image.imageUrl}
  //               alt={String(image.id)}
  //               className="w-full h-full object-cover rounded-lg"
  //               style={{ minHeight: 0, minWidth: 0 }}
  //             />
  //           </div>
  //           <div className="flex w-full flex-col md:w-80 bg-light-gray">
  //             <DialogHeader className="border-b p-4">
  //               <DialogTitle className="text-center">{image.ImageName || image.filename}</DialogTitle>
  //             </DialogHeader>
  //             <div className="flex flex-col p-4 space-y-4 flex-1">
  //               <div className="flex flex-col">
  //                   <span>Uploaded by:</span>
  //                   <span className="text-white-900">{isLoading ? "Loading..." : uploaderInfo?.fullName}</span>
  //                   <span className="text-white-900">Created at: {new Date(image.createdAt).toLocaleString()}</span>
  //               </div>
  //               <div className="mt-4">
  //                   <DeleteButton idAsNumber={image.id}/>
                    
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </DialogContent>
  //     </Dialog>
  //   </div>
  
}