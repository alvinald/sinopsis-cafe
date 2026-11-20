"use client";

import { CheckIcon, ListIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import Link from "next/link";
import { useState } from "react";

export const EditButton = ({
  href,
  onClick,
  label = "Edit",
}: {
  href?: string;
  onClick?: () => void;
  label?: string;
}) => {
  const button = (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 text-muted-foreground hover:text-purple-600"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <PencilIcon />
    </Button>
  );

  if (!href) return button;

  return <Link href={`${href}`}>{button}</Link>;
};

export const DetailButton = ({ href }: { href: string }) => {
  return (
    <Link href={`${href}`}>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-muted-foreground hover:text-foreground"
        aria-label="Detail item"
        title="Detail item"
      >
        <ListIcon />
      </Button>
    </Link>
  );
};

export const DeleteButton = ({
  onDelete,
  label = "Hapus",
  title = "Hapus data?",
  description = "Tindakan ini tidak dapat dibatalkan.",
}: {
  onDelete: () => Promise<void>;
  label?: string;
  title?: string;
  description?: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      await onDelete(); // panggil handleDelete page (fetch DELETE)
      setOpen(false); // ✅ sukses → tutup dialog
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      // ❌ gagal → dialog tetap terbuka, error tampil di dalamnya
    } finally {
      setDeleting(false);
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            aria-label={label}
            title={label}
          >
            <Trash2Icon />
          </Button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Batal</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleting}
            onClick={handleDelete}
          >
            {deleting ? "Menghapus..." : label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const ApproveButton = ({
  onApprove,
  disabled,
  withLabel = false,
}: {
  onApprove: () => Promise<void>;
  disabled?: boolean;
  withLabel?: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    setApproving(true);
    setError(null);
    try {
      await onApprove();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve");
    } finally {
      setApproving(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <button
            type="button"
            disabled={disabled}
            className={cn(
              withLabel
                ? "inline-flex h-8 items-center gap-1.5 rounded-md bg-emerald-600 px-3 text-xs font-medium text-white transition-colors hover:bg-emerald-600/90 disabled:pointer-events-none disabled:opacity-50"
                : buttonVariants({ variant: "ghost", size: "icon" }),
              withLabel ||
                "size-8 text-muted-foreground hover:text-emerald-600",
            )}
            aria-label="Approve"
            title="Approve"
          >
            <CheckIcon />
            {withLabel && <span>Approve</span>}
          </button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-500">
            <CheckIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Approve?</AlertDialogTitle>
          <AlertDialogDescription>
            This will approve this purchase order.
          </AlertDialogDescription>
          {error != null && (
            <div className="text-sm text-destructive">{error}</div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={approving} onClick={handleApprove}>
            {approving ? "Approving..." : "Approve"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
