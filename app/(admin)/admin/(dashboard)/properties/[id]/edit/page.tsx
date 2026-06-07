"use client"

import { useEffect, useState } from "react"
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
}

export default function EditPropertyPage() {
  const params = useParams()
  const router = useRouter()
  const id     = params.id as string

  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState("")
  const [success,  setSuccess]  = useState("")

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

        // Fill form with existing data
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
        })

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value,
    }))
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
        }),
      })

      if (res.ok) {
        setSuccess("✅ Property updated successfully!")
        // Go back to properties list after 2 seconds
        setTimeout(() => {
          router.push("/admin/properties")
        }, 2000)
      } else {
        const data = await res.json()
        setError(data.error || "❌ Failed to update property")
      }

    } catch (err) {
      setError("❌ Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  // Loading state
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

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow p-6 flex flex-col gap-5"
      >

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
            placeholder="e.g. Beautiful House in Kigali"
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
              placeholder="e.g. 240000000"
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
              placeholder="e.g. Kibagabaga, Kigali"
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
              placeholder="e.g. 400"
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
              placeholder="e.g. 4"
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
              placeholder="e.g. 2"
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
            placeholder="Describe the property..."
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

        {/* Buttons */}
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
