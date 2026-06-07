"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"

interface PropertyForm {
  title:       string
  type:        string
  listing:     string
  price:       string
  currency:    string
  location:    string
  size:        string
  bedrooms:    string
  bathrooms:   string
  description: string
  status:      string
  featured:    boolean
  images:      string[]
}

export default function EditPropertyPage() {
  const params  = useParams()
  const router  = useRouter()
  const id      = params.id as string
  const fileRef = useRef<HTMLInputElement>(null)

  const [loading,       setLoading]       = useState(true)
  const [saving,        setSaving]        = useState(false)
  const [uploading,     setUploading]     = useState(false)
  const [error,         setError]         = useState("")
  const [success,       setSuccess]       = useState("")
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const [form, setForm] = useState<PropertyForm>({
    title:       "",
    type:        "house",
    listing:     "For Sale",
    price:       "",
    currency:    "FRW",
    location:    "",
    size:        "",
    bedrooms:    "",
    bathrooms:   "",
    description: "",
    status:      "available",
    featured:    false,
    images:      [],
  })

  // Fetch existing property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res  = await fetch(`/api/properties/${id}`)
        const data = await res.json()

        if (!res.ok) {
          setError("Property not found")
          return
        }

        // Parse images
        let images: string[] = []
        try {
          images = Array.isArray(data.images)
            ? data.images
            : JSON.parse(data.images || "[]")
        } catch {
          images = []
        }

        setForm({
          title:       data.title       || "",
          type:        data.type        || "house",
          listing:     data.listing     || "For Sale",
          price:       data.price?.toString() || "",
          currency:    data.currency    || "FRW",
          location:    data.location    || "",
          size:        data.size?.toString() || "",
          bedrooms:    data.bedrooms?.toString() || "",
          bathrooms:   data.bathrooms?.toString() || "",
          description: data.description || "",
          status:      data.status      || "available",
          featured:    data.featured    || false,
          images,
        })

        setPreviewImages(images)

      } catch (err) {
        setError("Failed to load property")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProperty()
  }, [id])

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value,
    }))
  }

  // Remove an existing image
  const handleRemoveImage = (index: number) => {
    const confirmed = window.confirm(
      "Remove this image?"
    )
    if (!confirmed) return

    const updated = previewImages.filter((_, i) => i !== index)
    setPreviewImages(updated)
    setForm((prev) => ({ ...prev, images: updated }))
  }

  // Upload new images
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      setUploading(true)

      try {
        const uploadedUrls: string[] = []

        for (const file of Array.from(files)) {
          const formData = new FormData()
          formData.append("file", file)

          const res = await fetch("/api/upload", {
            method: "POST",
            body:   formData,
          })

          if (res.ok) {
            const data = await res.json()
            uploadedUrls.push(data.url)
          } else {
            const data = await res.json()
            console.error("Upload error:", data)
            setError(data.error || "Failed to upload image")
          }
        }

        if (uploadedUrls.length > 0) {
          // Add new images to existing ones
          const updated = [...previewImages, ...uploadedUrls]
          setPreviewImages(updated)
          setForm((prev) => ({ ...prev, images: updated }))
        }

      } catch (err) {
        console.error("Upload error:", err)
        setError("Failed to upload images")
      } finally {
        setUploading(false)
      }
    }

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch(`/api/properties/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price:     parseFloat(form.price),
          size:      parseFloat(form.size),
          bedrooms:  form.bedrooms  ? parseInt(form.bedrooms)  : null,
          bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
          images:    JSON.stringify(previewImages),
        }),
      })

      if (res.ok) {
        setSuccess("✅ Property updated successfully!")
        setTimeout(() => router.push("/admin/properties"), 2000)
      } else {
        const data = await res.json()
        setError(data.error || "❌ Failed to update")
      }

    } catch (err) {
      setError("❌ Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/admin/properties")}
          className="text-gray-500 hover:text-[#0B1F3A] transition"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-[#0B1F3A]">
          Edit Property
        </h1>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow p-6 flex flex-col gap-5"
      >

        {/* ── IMAGES SECTION ── */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Property Images
          </label>

          {/* Existing Images Grid */}
          {previewImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {previewImages.map((img, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden border border-gray-200"
                >
                  {/* Image */}
                  <img
                    src={img}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-40 object-cover"
                  />

                  {/* Delete button — shows on hover */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-600 text-sm"
                  >
                    ✕
                  </button>

                  {/* Image number badge */}
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-400 mb-4">
              🖼️ No images yet
            </div>
          )}

          {/* Upload New Images Button */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full border-2 border-dashed border-[#C9A84C] text-[#C9A84C] py-3 rounded-xl hover:bg-yellow-50 transition font-medium disabled:opacity-50"
          >
            {uploading
              ? "⏳ Uploading..."
              : "📷 Upload New Images"}
          </button>

          <p className="text-xs text-gray-400 mt-2">
            Hover over an image and click ✕ to remove it.
            You can upload multiple images at once.
          </p>
        </div>

        {/* ── ALL OTHER FIELDS ── */}

        {/* Title */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Property Title *
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            required
          />
        </div>

        {/* Type + Listing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Property Type *
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            >
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="plot">Plot / Land</option>
              <option value="furnished">Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Listing Type *
            </label>
            <select
              name="listing"
              value={form.listing}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            >
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
            </select>
          </div>
        </div>

        {/* Price + Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Price *
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Currency *
            </label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            >
              <option value="FRW">FRW</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        {/* Location + Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Size (sqm) *
            </label>
            <input
              type="number"
              name="size"
              value={form.size}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              required
            />
          </div>
        </div>

        {/* Bedrooms + Bathrooms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Bedrooms
            </label>
            <input
              type="number"
              name="bedrooms"
              value={form.bedrooms}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Bathrooms
            </label>
            <input
              type="number"
              name="bathrooms"
              value={form.bathrooms}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Status *
          </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="in_talks">In Talks</option>
            </select>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Description *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] resize-none"
            required
          />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="featured"
            id="featured"
            checked={form.featured}
            onChange={handleChange}
            className="w-4 h-4 accent-[#C9A84C]"
          />
          <label
            htmlFor="featured"
            className="text-sm font-medium text-gray-700"
          >
            Mark as Featured Property
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-[#C9A84C] text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/properties")}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  )
}
