"use client"

import { ArrowLeft, Pencil, Eye, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

type FormHeaderProps = {
  isDirty: boolean
  onSave: () => void
  onClear: () => void
  hasFields: boolean
  activeTab: "canvas" | "preview"
  onTabChange: (tab: "canvas" | "preview") => void
}

export default function FormHeader({
  isDirty,
  onSave,
  onClear,
  hasFields,
  activeTab,
  onTabChange
}: FormHeaderProps) {
  return (
    <div className="flex justify-between items-center px-5 py-6 border-b">
      
      {/* Left Section */}
      <div className="flex flex-cols-2 gap-2">      
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-xl font-semibold">
            Form 3
          </h1>
          <p className="text-sm text-muted-foreground">
            Drag and drop fields to build your form
          </p>
        </div>   
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">

        <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as "canvas" | "preview")}>
        <TabsList>
          <TabsTrigger value="canvas" className="gap-2">
            <Pencil className="h-4 w-4" />
            Canvas
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>
      </Tabs>

        {/* 🔥 Clear All Confirmation */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              disabled={!hasFields}
              className="gap-2 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <Trash className="h-4 w-4" />
              Clear All
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Clear all fields?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove all fields from your form.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onClear}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Save Button */}
        <Button
          onClick={onSave}
          disabled={!isDirty}
          className={`
            px-4 py-2 rounded-md text-white transition-all duration-200
            ${isDirty 
              ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              : "bg-blue-300 cursor-not-allowed"
            }
          `}
        >
          Save Form
        </Button>

      </div>
    </div>
  )
}