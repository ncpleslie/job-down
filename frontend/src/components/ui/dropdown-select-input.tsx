import { ChevronDown, ChevronUp, SendHorizontal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { snakeCaseToTitleCase } from "@/lib/utils/helper.utils";
import { Input } from "./input";
import { useState } from "react";

interface DropdownInputProps {
  title: string;
  options: { id: string; label: string }[];
  currentSelection?: string;
  isPendingUpdate: boolean;
  onSubmit: (option: string) => void;
}

export function DropdownSelectInput({
  title,
  options,
  currentSelection,
  isPendingUpdate,
  onSubmit,
}: DropdownInputProps) {
  const [open, setOpen] = useState(false);
  const onSelect = (newStatus: string) => {
    onSubmit(newStatus);
    setOpen(false);
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const newStatus = formData.get("new-status") as string;
    setOpen(false);
    onSubmit(newStatus);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-transparent px-1 capitalize md:px-4"
          disabled={isPendingUpdate}
        >
          <span className="w-full">{title}</span>
          {isPendingUpdate && (
            <Loader2 className="ml-auto h-4 w-4 animate-spin" />
          )}
          {!open && !isPendingUpdate && (
            <ChevronDown className="ml-auto h-4 w-4" />
          )}
          {open && !isPendingUpdate && (
            <ChevronUp className="ml-auto h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        {options.map((option) => (
          <Button
            key={option.id}
            type="button"
            variant="ghost"
            className={cn(
              "w-full justify-start capitalize",
              currentSelection === option.id && "bg-gray-200",
            )}
            disabled={currentSelection === option.id}
            onClick={() => onSelect(option.id)}
          >
            {snakeCaseToTitleCase(option.label)}
          </Button>
        ))}
        <Separator />

        <form onSubmit={submit} className="mx-1 my-1 flex flex-row gap-1">
          <Input id="new-status" name="new-status" />
          <Button type="submit" variant="outline" className="w-8 p-2">
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
