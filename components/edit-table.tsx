'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Switch } from "@/components/ui/switch"
import { Table } from "@/lib/menu"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(1, 'Table number is required'),
  capacity: z.string().min(1, 'Seating capacity is required'),
  status: z.boolean().default(true),
})

interface EditTableProps {
  table: Table
  isOpen: boolean
  onClose: () => void
  onSave: (updatedTable: Table) => void
}

export function EditTable({ table, isOpen, onClose, onSave }: EditTableProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: table.name,
      capacity: String(table.capacity),
      status: table.status,
    },
  })

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const updatedTable: Table = {
        ...table,
        name: data.name,
        capacity: parseInt(data.capacity),
        status: data.status,
      }
      await onSave(updatedTable)
      onClose()
      form.reset()
    } catch (error) {
      toast.error('Something went wrong')
      console.error(error)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>Edit Table</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Table Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter table number" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seating Capacity</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="Enter seating capacity" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Available</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save changes
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}

