"use client"

import React, { useState } from "react"
import Navbar from "../components/navbar"
import FormHeader from "../components/form-header"

import {
    Type, Mail, AlignLeft, Hash, Phone,
    Link as LinkIcon, Calendar, FileText,
    CheckSquare, Circle, List
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs"

import {
    DndContext,
    useDraggable,
    useDroppable,
    DragOverlay,
    useDndMonitor
} from "@dnd-kit/core"

import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove
} from "@dnd-kit/sortable"

import { CSS } from "@dnd-kit/utilities"

export default function Page() {

    const [mounted, setMounted] = useState(false)

    React.useEffect(() => {
    setMounted(true)
    }, [])

    const fieldTypes = [
        { name: "Text", icon: Type },
        { name: "Email", icon: Mail },
        { name: "Textarea", icon: AlignLeft },
        { name: "Number", icon: Hash },
        { name: "Phone", icon: Phone },
        { name: "URL", icon: LinkIcon },
        { name: "Date", icon: Calendar },
        { name: "File", icon: FileText },
        { name: "Checkbox", icon: CheckSquare },
        { name: "Radio", icon: Circle },
        { name: "Select", icon: List },
    ]

    type FieldItem = {
        id: string
        type: string
    }

    const [fields, setFields] = useState<FieldItem[]>([])
    const [activeField, setActiveField] = useState<string | null>(null)
    const [previewIndex, setPreviewIndex] = useState<number | null>(null)



    const htmlCode = `<form action="https://formdb.io/f/kmXZIovD" method="POST" enctype="multipart/form-data">
    <input type="email" name="email" placeholder="Email" required />
    <textarea name="message" placeholder="Message"></textarea>
    <button type="submit">Submit</button>
    </form>`

    const reactCode = `function ContactForm() {

        const handleSubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            e.preventDefault();
            const formData = new FormData(e.target);
            
            // For v3, get token before submitting
            // const token = await handleRecaptcha();
            // formData.append("g-recaptcha-response", token);

            const response = await fetch("https://formdb.io/f/kmXZIovD", {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json"
            }
            });
            
            const result = await response.json();
            console.log('Response:', result);
        };

        return (
            <form onSubmit={handleSubmit}>
            <input name="email" type="email" placeholder="Email" required />
            <textarea name="message" placeholder="Message" />

            <button type="submit">Submit</button>
            </form>
        );
        }`

    const vueCode = `<template>
        <form @submit.prevent="handleSubmit">
            <input type="email" v-model="form.email" placeholder="Email" required />
            <textarea v-model="form.message" placeholder="Message" required></textarea>

            <button type="submit">Submit</button>
        </form>
        </template>

        <script>
        export default {
        data() {
            return {
            form: {
                email: '',
                message: ''
            }
            }
        },
        methods: {
            async handleSubmit() {
            await fetch("https://formdb.io/f/kmXZIovD", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                },
                body: JSON.stringify(this.form)
            });
            }
        }
        }
        </script>`

    const jQueryCode = `$.ajax({
        url: "https://formdb.io/f/kmXZIovD",
        method: "POST",
        data: {
            email: "user@example.com",
            message: "Hello world"
        },
        dataType: "json",
        success: function(data) {
            console.log(data);
        },
        error: function(err) {
            console.error(err);
        }
        });`

    // const [copied, setCopied] = useState(false)

    // onClick={() => {
    // navigator.clipboard.writeText(codeString)
    // setCopied(true)
    // setTimeout(() => setCopied(false), 1500)
    // }}

    function CodeBlock({ codeString }: { codeString: string }) {
        return (
            <div className="relative flex-1 min-h-0 border rounded-lg bg-muted text-sm overflow-hidden">

                <button
                    onClick={() => navigator.clipboard.writeText(codeString)}
                    className="absolute top-3 right-3 text-xs px-3 py-1 rounded-md bg-background border hover:bg-muted transition z-10"
                >
                    Copy
                </button>

                <div className="h-full w-full overflow-auto">
                    <pre className="p-4 whitespace-pre min-w-max">
                        {codeString}
                    </pre>
                </div>

            </div>
        )
    }

    function handleDragEnd(event: any) {
  const { active, over } = event

  if (!over) return

  const isExisting = fields.some((f) => f.id === active.id)

  // ✅ Dropping NEW field from sidebar
  if (!isExisting) {
    const newField: FieldItem = {
      id: `${active.id}-${Date.now()}`,
      type: active.id,
    }

    const newFields = [...fields]

    const insertIndex =
      previewIndex !== null ? previewIndex : newFields.length

    newFields.splice(insertIndex, 0, newField)

    setFields(newFields)
    setPreviewIndex(null)
    return
  }

  // ✅ Reordering inside canvas
  const oldIndex = fields.findIndex((f) => f.id === active.id)
  const newIndex = fields.findIndex((f) => f.id === over.id)

  if (oldIndex !== newIndex) {
    setFields(arrayMove(fields, oldIndex, newIndex))
  }

  setPreviewIndex(null)
}
    function DraggableField({ name, icon: Icon }: any) {
        const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
            id: name,
        })

        return (
            <div
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                className={`flex items-center gap-3 p-3 border rounded-lg 
                        cursor-grab transition
                        ${isDragging ? "opacity-40" : "hover:bg-muted"}`}
            >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{name}</span>
            </div>
        )
    }

    function SortableField({ id, label }: { id: string; label: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 border rounded-lg bg-background cursor-grab transition
        ${isDragging ? "opacity-40" : ""}`}
    >
      {label} Field
    </div>
  )
}

    function Canvas({ fields }: { fields: FieldItem[] }) {
  const { setNodeRef } = useDroppable({ id: "canvas" })

  return (
    <div
      ref={setNodeRef}
      className="h-full border-2 border-dashed rounded-xl bg-muted/30 p-6 overflow-auto"
    >
      <SortableContext
        items={fields.map((f) => f.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-4">
          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              {previewIndex === index && (
                <div className="h-12 rounded-lg border-2 border-dashed border-primary opacity-50 bg-primary/10" />
              )}

              <SortableField id={field.id} label={field.type} />
            </React.Fragment>
          ))}

          {previewIndex === fields.length && (
            <div className="h-12 rounded-lg border-2 border-dashed border-primary opacity-50 bg-primary/10" />
          )}
        </div>
      </SortableContext>
    </div>
  )
}

function DragMonitor({
  fields,
  previewIndex,
  setPreviewIndex,
}: {
  fields: FieldItem[]
  previewIndex: number | null
  setPreviewIndex: React.Dispatch<React.SetStateAction<number | null>>
}) {
  useDndMonitor({
    onDragOver(event) {
      const { active, over } = event
      if (!over) return

      const isFromCanvas = fields.some((f) => f.id === active.id)

      // ❗ Only allow preview if:
      // - dragging existing canvas item
      // - OR dragging sidebar item over canvas
      if (!isFromCanvas && over.id !== "canvas" && !fields.some(f => f.id === over.id)) {
        return
      }

      let newIndex: number | null = null

      const overIndex = fields.findIndex((f) => f.id === over.id)

      if (overIndex !== -1) {
        newIndex = overIndex
      } else if (over.id === "canvas") {
        newIndex = fields.length
      }

      if (newIndex !== previewIndex) {
        setPreviewIndex(newIndex)
      }
    },

    onDragEnd() {
      setPreviewIndex(null)
    },
  })

  return null
}

    return (
        <div>
            <Navbar />
            <FormHeader />
            
            {mounted && (
                <DndContext
                    onDragStart={(event) => {
                    setActiveField(event.active.id as string)
                    }}
                    onDragEnd={(event) => {
                    handleDragEnd(event)
                    setActiveField(null)
                    }}
                >
                <DragMonitor
                    fields={fields}
                    previewIndex={previewIndex}
                    setPreviewIndex={setPreviewIndex}
                    />
                <div className="grid grid-cols-[300px_1fr_600px] h-[calc(100vh-200px)]">
                    <div className="border-r p-6 overflow-y-auto">

                        <h2 className="text-lg font-semibold mb-1">Field Types</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Drag fields to the canvas
                        </p>

                        <div className="flex flex-col gap-3">
                            {fieldTypes.map((field) => (
                                <DraggableField
                                    key={field.name}
                                    name={field.name}
                                    icon={field.icon}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="border-r p-6 min-h-0">
                        <Canvas fields={fields} />
                    </div>


                    <div className="p-6 flex flex-col">

                        <Tabs defaultValue="html" className="flex flex-col h-full">

                            <TabsList className="grid grid-cols-4 w-full">
                                <TabsTrigger value="html">HTML</TabsTrigger>
                                <TabsTrigger value="react">React</TabsTrigger>
                                <TabsTrigger value="vue">Vue</TabsTrigger>
                                <TabsTrigger value="jquery">jQuery</TabsTrigger>
                            </TabsList>

                            <TabsContent value="html" className="flex-1 mt-4">
                                <CodeBlock codeString={htmlCode} />
                            </TabsContent>

                            <TabsContent value="react" className="flex-1 mt-4">
                                <CodeBlock codeString={reactCode} />
                            </TabsContent>

                            <TabsContent value="vue" className="flex-1 mt-4">
                                <CodeBlock codeString={vueCode} />
                            </TabsContent>

                            <TabsContent value="jquery" className="flex-1 mt-4">
                                <CodeBlock codeString={jQueryCode} />
                            </TabsContent>

                        </Tabs>

                    </div>

                </div>
                <DragOverlay>
                    {activeField ? (
                        <div
                            className="flex items-center gap-3 p-3 border rounded-lg bg-background 
                            shadow-2xl opacity-95 cursor-grabbing backdrop-blur-sm
                            scale-105"
                        >
                            <span className="text-sm font-medium">{activeField}</span>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
            )}
        </div>
    )
}

