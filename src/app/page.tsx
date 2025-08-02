import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

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
          Welcove to Cloud!
        </div>
      </SignedIn>

    </main>
  );
}
