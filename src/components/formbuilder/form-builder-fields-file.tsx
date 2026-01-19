import {type FileWithPreview, formatBytes, useFileUpload} from "@/hooks/use-file-upload"
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert"
import {Button} from "@/components/ui/button"
import {TriangleAlert, User, X} from "lucide-react"
import {cn} from "@/lib/utils"
import {Controller, useFormContext} from "react-hook-form"
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field"
import {useCallback, useState} from "react"
import {supabase} from "@/lib/supabase-client"
import {toast} from "sonner"

interface AvatarUploadProps {
  maxSize?: number
  className?: string
  onFileChange?: (file: FileWithPreview | null) => void
  defaultAvatar?: string
  disabled?: boolean
}

function AvatarUpload({
                        maxSize = 2 * 1024 * 1024, // 2MB
                        className,
                        onFileChange,
                        defaultAvatar,
                        disabled = false,
                      }: AvatarUploadProps) {
  const [
    {files, isDragging, errors},
    {
      removeFile,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept: "image/*",
    multiple: false,
    onFilesAdded: (addedFiles) => {
      // Only trigger when files are actually added, not when cleared
      if (addedFiles.length > 0) {
        onFileChange?.(addedFiles[0] || null)
      }
    },
    onFilesChange: (files) => {
      // Handle file removal (when files array becomes empty)
      if (files.length === 0) {
        onFileChange?.(null)
      }
    },
  })

  const currentFile = files[0]
  const previewUrl = currentFile?.preview || defaultAvatar

  const handleRemove = () => {
    if (currentFile) {
      removeFile(currentFile.id)
    }
  }

  return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        {/* Avatar Preview */}
        <div className="relative">
          <div
              className={cn(
                  "group/avatar relative h-24 w-24 overflow-hidden rounded-full border border-dashed transition-colors",
                  disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                  isDragging && !disabled
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-muted-foreground/20",
                  previewUrl && "border-solid"
              )}
              onDragEnter={disabled ? undefined : handleDragEnter}
              onDragLeave={disabled ? undefined : handleDragLeave}
              onDragOver={disabled ? undefined : handleDragOver}
              onDrop={disabled ? undefined : handleDrop}
              onClick={disabled ? undefined : openFileDialog}>
            <input {...getInputProps({disabled})} className="sr-only"/>

            {previewUrl ? (
                <img src={previewUrl} alt="Avatar"
                     className="h-full w-full object-cover"/>
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="size-6 text-muted-foreground"/>
                </div>
            )}
          </div>

          {/* Remove Button - only show when file is uploaded */}
          {currentFile && (
              <Button
                  size="icon"
                  variant="outline"
                  onClick={handleRemove}
                  className="size-6 absolute end-0 top-0 rounded-full"
                  aria-label="Remove avatar">
                <X className="size-3.5"/>
              </Button>
          )}
        </div>

        {/* Upload Instructions */}
        <div className="text-center space-y-0.5">
          <p className="text-sm font-medium">
            {currentFile ? "Avatar uploaded" : "Upload avatar"}
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG up to {formatBytes(maxSize)}
          </p>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
            <Alert variant="destructive" appearance="light" className="mt-5">
              <AlertIcon>
                <TriangleAlert/>
              </AlertIcon>
              <AlertContent>
                <AlertTitle>File upload error(s)</AlertTitle>
                <AlertDescription>
                  {errors.map((error, index) => (
                      <p key={index} className="last:mb-0">
                        {error}
                      </p>
                  ))}
                </AlertDescription>
              </AlertContent>
            </Alert>
        )}
      </div>
  )
}

interface FBAvatarUploadProps {
  name: string
  label?: string
  description?: string
  bucketName?: string
  folder: string
  maxSize?: number
  disabled?: boolean
  /**
   * Function to generate the file name in storage.
   * If not provided, uses: `${name}-${timestamp}-${random}.${extension}`
   */
  generateFileName?: (file: File, fieldName: string) => string
  /**
   * Whether to delete the old file from storage when a new one is uploaded.
   * Defaults to true.
   */
  deleteOldFile?: boolean
}

export function FBAvatarUpload({
                                 name,
                                 label,
                                 description,
                                 bucketName = "storage",
                                 folder,
                                 maxSize = 2 * 1024 * 1024, // 2MB
                                 disabled,
                                 generateFileName,
                                 deleteOldFile = true,
                               }: FBAvatarUploadProps) {
  const {control} = useFormContext()
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const defaultGenerateFileName = useCallback((file: File, fieldName: string) => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    const extension = file.name.split(".").pop()
    return `${fieldName}-${timestamp}-${random}.${extension}`
  }, [])

  const normalizeFolderPath = useCallback((folderPath: string): string => {
    // Remove leading and trailing slashes, then ensure no double slashes
    return folderPath.replace(/^\/+|\/+$/g, "").replace(/\/+/g, "/")
  }, [])

  const extractFilePathFromUrl = useCallback(
      (url: string, expectedBucket: string): string | null => {
        try {
          const urlObj = new URL(url)
          // Supabase public URL format: /storage/v1/object/public/[bucket]/[path]
          const publicPathMatch = urlObj.pathname.match(
              /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/
          )

          if (publicPathMatch) {
            const [, bucket, filePath] = publicPathMatch
            // Only delete if it's from the expected bucket
            if (bucket === expectedBucket) {
              return filePath
            }
          }
        } catch (error) {
          console.error("Error parsing URL:", error)
        }
        return null
      },
      []
  )

  const handleFileChange = useCallback(
      async (
          file: FileWithPreview | null,
          currentUrl: string | null,
          onChange: (url: string | null) => void
      ) => {
        if (!file || !(file.file instanceof File)) {
          // File removed
          if (deleteOldFile && currentUrl) {
            try {
              const filePath = extractFilePathFromUrl(currentUrl, bucketName)
              if (filePath) {
                await supabase.storage.from(bucketName).remove([filePath])
              }
            } catch (error) {
              console.error("Error deleting old file:", error)
              // Don't block the user if deletion fails
            }
          }
          onChange(null)
          setUploadError(null)
          return
        }

        // Prevent duplicate uploads - check if already uploading
        if (uploading) {
          return
        }

        // New file selected - upload to Supabase
        setUploading(true)
        setUploadError(null)

        try {
          const fileName = generateFileName
              ? generateFileName(file.file, name)
              : defaultGenerateFileName(file.file, name)

          // Normalize folder path and construct full storage path
          const normalizedFolder = normalizeFolderPath(folder)
          const storagePath = normalizedFolder
              ? `${normalizedFolder}/${fileName}`
              : fileName

          // Upload file to Supabase storage
          const {error: uploadError} = await supabase.storage
              .from(bucketName)
              .upload(storagePath, file.file, {
                cacheControl: "3600",
                upsert: true,
              })

          if (uploadError) {
            throw uploadError
          }

          // Get public URL
          const {data: urlData} = supabase.storage
              .from(bucketName)
              .getPublicUrl(storagePath)

          if (!urlData?.publicUrl) {
            throw new Error("Failed to get public URL")
          }

          // Delete old file if it exists and deleteOldFile is true
          if (deleteOldFile && currentUrl && currentUrl !== urlData.publicUrl) {
            try {
              const oldFilePath = extractFilePathFromUrl(currentUrl, bucketName)
              if (oldFilePath) {
                await supabase.storage.from(bucketName).remove([oldFilePath])
              }
            } catch (error) {
              console.error("Error deleting old file:", error)
              // Don't block the user if deletion fails
            }
          }

          // Update form field with new URL
          onChange(urlData.publicUrl)
          toast.success("Image uploaded successfully")
        } catch (error: any) {
          const errorMessage = error?.message || "Failed to upload image"
          setUploadError(errorMessage)
          toast.error(errorMessage)
          onChange(null)
        } finally {
          setUploading(false)
        }
      },
      [
        bucketName,
        folder,
        name,
        generateFileName,
        defaultGenerateFileName,
        deleteOldFile,
        extractFilePathFromUrl,
        normalizeFolderPath,
      ]
  )

  return (
      <Controller
          name={name}
          control={control}
          render={({field, fieldState}) => {
            const currentUrl = field.value || null

            return (
                <Field data-invalid={fieldState.invalid || !!uploadError}
                       className="w-fit">
                  <FieldContent>
                    {label && (<FieldLabel htmlFor={name}>{label}</FieldLabel>)}
                    {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                  </FieldContent>
                  <div className="space-y-4">
                    <AvatarUpload
                        maxSize={maxSize}
                        defaultAvatar={currentUrl}
                        disabled={disabled || uploading}
                        onFileChange={(file) =>
                            handleFileChange(file, currentUrl, field.onChange)
                        }
                    />
                    {uploading && (
                        <p className="text-sm text-muted-foreground text-center">Uploading...</p>
                    )}
                    {uploadError && (
                        <Alert variant="destructive" appearance="light">
                          <AlertIcon>
                            <TriangleAlert/>
                          </AlertIcon>
                          <AlertContent>
                            <AlertTitle>Upload error</AlertTitle>
                            <AlertDescription>{uploadError}</AlertDescription>
                          </AlertContent>
                        </Alert>
                    )}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                  </div>
                </Field>
            )
          }}
      />
  )
}
