"use client"

import React, { Fragment, useEffect, useState } from "react"
import Navbar from "../components/navbar"
import FormHeader from "../components/form-header"
import { generateHTML, generateJQuery, generateReact, generateVue } from "@/lib/code-generator"

import {
    Type, Mail, AlignLeft, Hash, Phone,
    Link as LinkIcon, Calendar, FileText,
    CheckSquare, Circle, List,
    Copy, Check, Trash
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

    useEffect(() => {
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
        name: string
        label: string
        placeholder?: string
        required?: boolean
        }

    const [fields, setFields] = useState<FieldItem[]>([])
    const [activeField, setActiveField] = useState<string | null>(null)
    const [previewIndex, setPreviewIndex] = useState<number | null>(null)
    const [isDirty, setIsDirty] = useState(false)
    const [initialFields, setInitialFields] = useState<FieldItem[]>([])
    const [formId, setFormId] = useState("id")

    const handleClear = () => {
    setFields([])
    setPreviewIndex(null)
    setActiveField(null)
    }

    const handleDeleteField = (id: string) => {
    setFields((prev) => prev.filter((field) => field.id !== id))
    }

    const handleSave = () => {
    setInitialFields(fields)
    setIsDirty(false)
    }

    const handleUpdateField = (
        id: string,
        updates: Partial<FieldItem>
        ) => {
        setFields((prev) =>
            prev.map((field) =>
            field.id === id ? { ...field, ...updates } : field
            )
        )
        }

    useEffect(() => {
    const hasChanges =
        JSON.stringify(fields) !== JSON.stringify(initialFields)

    setIsDirty(hasChanges)
    }, [fields, initialFields])


    function CodeBlock({ codeString }: { codeString: string }) {
    const [copied, setCopied] = React.useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(codeString)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <div className="flex flex-col h-full border rounded-lg bg-muted text-sm overflow-hidden">

        {/* Header */}
        <div className="flex justify-end pt-2 pr-2">
            <div className="relative group">

            {/* Tooltip */}
            {!copied && (
                <div className="
                absolute -top-9 right-0
                bg-black text-white text-xs
                px-2 py-1 rounded-md
                opacity-0 group-hover:opacity-100
                transition
                whitespace-nowrap
                ">
                Click to copy
                </div>
            )}

            <button
                onClick={handleCopy}
                className={`
                p-2 rounded-md border transition-all duration-200
                ${copied 
                    ? "bg-green-500 border-green-500 text-white" 
                    : "bg-white hover:bg-primary hover:text-white hover:border-primary"}
                `}
            >
                {copied ? (
                <Check className="h-4 w-4" />
                ) : (
                <Copy className="h-4 w-4" />
                )}
            </button>

            </div>
        </div>

        {/* Code Area */}
        <div className="flex-1 overflow-auto">
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
    const baseName = active.id.toLowerCase()

    // Count existing fields of same type
    const sameTypeFields = fields.filter(
        (field) => field.type === active.id
    )

    let uniqueName = baseName

    if (sameTypeFields.length > 0) {
        uniqueName = `${baseName}_${sameTypeFields.length}`
    }

        const newField: FieldItem = {
            id: `${active.id}-${Date.now()}`,
            type: active.id,
            name: uniqueName,
            label: active.id,
            placeholder: "",
            required: false,
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

        function SortableField({
    field,
    onDelete,
    onUpdate,
    isActive,
    onClick,
    }: {
    field: FieldItem
    onDelete: (id: string) => void
    onUpdate: (id: string, updates: Partial<FieldItem>) => void
    isActive: boolean
    onClick: () => void
    }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: field.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
        ref={setNodeRef}
        style={style}
        className={`border rounded-lg bg-background transition ${
            isDragging ? "opacity-40" : ""
        }`}
        >
        {/* Header */}
        <div className="flex items-start justify-between p-4">

            {/* LEFT SIDE */}
            <div className="flex-1 cursor-pointer" onClick={onClick}>
            <div className="font-medium flex items-center gap-2">
                {field.label}
                {field.required && (
                <span className="text-red-500 text-sm">*</span>
                )}
            </div>

            {/* Inline name + placeholder */}
            <div className="text-sm text-muted-foreground flex gap-4 mt-1">
                <span>name: {field.name}</span>

                {field.placeholder && (
                <span>
                    placeholder: {field.placeholder}
                </span>
                )}
            </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-2">

            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab px-2 text-muted-foreground"
            >
                ⋮⋮
            </div>

            {/* Delete */}
            <button
                onClick={(e) => {
                e.stopPropagation()
                onDelete(field.id)
                }}
                className="opacity-0 group-hover:opacity-100 transition p-1 rounded-md hover:bg-red-50"
            >
                <Trash className="h-4 w-4 text-red-500" />
            </button>
            </div>
        </div>

        {/* EXPANDED DETAILS */}
        {isActive && (
            <div
            className="border-t p-4 space-y-4 bg-muted/30"
            onClick={(e) => e.stopPropagation()}
            >
            {/* Label */}
            <div>
                <p className="text-sm font-medium mb-1">Label</p>
                <input
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={field.label}
                onChange={(e) =>
                    onUpdate(field.id, { label: e.target.value })
                }
                />
            </div>

            {/* Name */}
            <div>
                <p className="text-sm font-medium mb-1">Name</p>
                <input
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={field.name}
                onChange={(e) =>
                    onUpdate(field.id, { name: e.target.value })
                }
                />
            </div>

            {/* Placeholder */}
            <div>
                <p className="text-sm font-medium mb-1">Placeholder</p>
                <input
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="Enter placeholder..."
                value={field.placeholder}
                onChange={(e) =>
                    onUpdate(field.id, { placeholder: e.target.value })
                }
                />
            </div>

            {/* Required */}
            <div className="flex items-center gap-2">
                <input
                type="checkbox"
                checked={field.required}
                onChange={(e) =>
                    onUpdate(field.id, { required: e.target.checked })
                }
                />
                <span className="text-sm">Required field</span>
            </div>
            </div>
        )}
        </div>
    )
    }

    function Canvas({ fields }: { fields: FieldItem[] }) {
    const { setNodeRef } = useDroppable({ id: "canvas" })

    return (
        <div
        ref={setNodeRef}
        className="h-full border-2 border-dashed rounded-xl bg-muted/30 p-6 overflow-auto flex flex-col"
        >
        {fields.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
                No fields yet
            </h3>
            <p className="text-sm max-w-sm">
                Drag and drop fields from the palette on the left to start building your form
            </p>
            </div>
        ) : (
            <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
            >
            <div className="flex flex-col gap-4">
                {fields.map((field, index) => (
                <Fragment key={field.id}>
                    {previewIndex === index && (
                    <div className="h-12 rounded-lg border-2 border-dashed border-primary opacity-50 bg-primary/10" />
                    )}
                    <SortableField  
                        key={field.id}
                        field={field}
                        isActive={activeField === field.id}
                        onClick={() =>
                            setActiveField(
                            activeField === field.id ? null : field.id
                            )
                        }
                        onDelete={handleDeleteField}
                        onUpdate={handleUpdateField}
                        />
                </Fragment>
                ))}

                {previewIndex === fields.length && (
                <div className="h-12 rounded-lg border-2 border-dashed border-primary opacity-50 bg-primary/10" />
                )}
            </div>
            </SortableContext>
        )}
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
            {/* <FormHeader /> */}
            <FormHeader
                isDirty={isDirty}
                onSave={handleSave}
                onClear={handleClear}
                hasFields={fields.length > 0}
                />
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
                                <CodeBlock codeString={generateHTML(fields, formId)} />
                            </TabsContent>

                            <TabsContent value="react" className="flex-1 mt-4">
                                <CodeBlock codeString={generateReact(fields, formId)} />
                            </TabsContent>

                            <TabsContent value="vue" className="flex-1 mt-4">
                                <CodeBlock codeString={generateVue(fields, formId)} />
                            </TabsContent>

                            <TabsContent value="jquery" className="flex-1 mt-4">
                                <CodeBlock codeString={generateJQuery(fields, formId)} />
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

