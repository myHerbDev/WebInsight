"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2, Globe } from "lucide-react"

const formSchema = z.object({
  websiteUrl: z.string().url({ message: "Please enter a valid URL." }),
})

interface WebsiteFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>
  isLoading: boolean
}

export function WebsiteForm({ onSubmit, isLoading }: WebsiteFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      websiteUrl: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input placeholder="https://www.example.com" {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>Enter the URL of the website you want to analyze.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            <>
              Analyze <Globe className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
