
"use client";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

export function EditButton({ idAsNumber }: { idAsNumber: number }) {
    const router = useRouter();

    function handleEdit() {
        router.push(`/edit/${idAsNumber}`);
    }

    return (
        <Button type="button" variant="outline" onClick={handleEdit} className="cursor-pointer">
            Edit
        </Button>
    );
}