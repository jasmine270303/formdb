"use client"

import { ArrowLeft, Pencil, Eye, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function FormHeader() {
  return (
    <div className="flex justify-between items-center px-5 py-6 border-b">

   
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


    
      <div className="flex items-center gap-3">

        <Tabs defaultValue="canvas">
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

        <Button variant="outline" className="gap-2 text-red-500">
          <Trash className="h-4 w-4" />
          Clear All
        </Button>

        <Button className="gap-2 bg-blue-700">
          Save Form
        </Button>

      </div>
    </div>
  )
}