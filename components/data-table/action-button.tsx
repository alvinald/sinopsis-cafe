  "use client"

  import { PencilIcon, Trash2Icon } from "lucide-react"
  import { Button } from "../ui/button"
  import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
  import Link from "next/link"
  import { useState } from "react"

  export const EditButton = ({
      href,
  }: {
      href: string
  }) => {
      return (
          <Link href={`${href}`} >
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-purple-600" aria-label="Edit user" title="Edit">
                  <PencilIcon />
              </Button>
          </Link>
      )
  }

  export const DeleteButton = ({
      onDelete,
  }: {
      onDelete: () => Promise<void>
  }) => {
    
      const [open, setOpen] = useState<boolean>(false)
      const [deleting, setDeleting] = useState(false)
      const [error, setError] = useState<string | null>(null)

      async function handleDelete() {
        setDeleting(true)
        setError(null)
        try {
          await onDelete()        // panggil handleDelete page (fetch DELETE)
          setOpen(false)          // ✅ sukses → tutup dialog
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to delete")
          // ❌ gagal → dialog tetap terbuka, error tampil di dalamnya
        } finally {
          setDeleting(false)
        }
      }
      return (
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger render={<Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" aria-label="Hapus user" title="Hapus">
              <Trash2Icon />
            </Button>}/>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                  <Trash2Icon />
                </AlertDialogMedia>
                <AlertDialogTitle>Delete?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this chat conversation.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive" disabled={deleting} onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      )
  }

