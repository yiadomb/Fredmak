"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface Resident {
  id: number;
  full_name: string;
  gender: string;
  phone: string;
  whatsapp: string;
  created_at: string;
}

export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ full_name: "", gender: "", phone: "", whatsapp: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ full_name: "", gender: "", phone: "", whatsapp: "" });
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const fetchResidents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("residents").select("*").order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setResidents(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValidPhone = (phone: string) => /^\d{8,15}$/.test(phone);

  const handleAddResident = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.full_name || !form.gender || !form.phone || !form.whatsapp) {
      setFormError("All fields are required.");
      return;
    }
    if (!isValidPhone(form.phone) || !isValidPhone(form.whatsapp)) {
      setFormError("Both phone numbers must be 8-15 digits.");
      return;
    }
    setFormLoading(true);
    const { error } = await supabase.from("residents").insert([form]);
    setFormLoading(false);
    if (error) {
      setFormError(error.message);
    } else {
      setForm({ full_name: "", gender: "", phone: "", whatsapp: "" });
      fetchResidents();
    }
  };

  const handleEditClick = (resident: Resident) => {
    setEditingId(resident.id);
    setEditForm({
      full_name: resident.full_name,
      gender: resident.gender,
      phone: resident.phone,
      whatsapp: resident.whatsapp,
    });
    setEditError("");
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id: number) => {
    setEditLoading(true);
    setEditError("");
    if (!editForm.full_name || !editForm.gender || !editForm.phone || !editForm.whatsapp) {
      setEditError("All fields are required.");
      setEditLoading(false);
      return;
    }
    if (!isValidPhone(editForm.phone) || !isValidPhone(editForm.whatsapp)) {
      setEditError("Both phone numbers must be 8-15 digits.");
      setEditLoading(false);
      return;
    }
    const { error } = await supabase.from("residents").update(editForm).eq("id", id);
    setEditLoading(false);
    if (error) {
      setEditError(error.message);
    } else {
      setEditingId(null);
      fetchResidents();
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditError("");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this resident?")) return;
    await supabase.from("residents").delete().eq("id", id);
    fetchResidents();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Residents</h1>
      <form onSubmit={handleAddResident} className="mb-8 bg-white p-4 rounded shadow max-w-md">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">Add Resident</h2>
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleInputChange}
          className="w-full mb-2 p-2 border rounded text-gray-900"
        />
        <div className="mb-2 flex gap-4 items-center">
          <span className="text-gray-700">Gender:</span>
          <label className="flex items-center gap-1 text-gray-900">
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={form.gender === "Male"}
              onChange={handleInputChange}
              className="accent-blue-600"
            />
            Male
          </label>
          <label className="flex items-center gap-1 text-gray-900">
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={form.gender === "Female"}
              onChange={handleInputChange}
              className="accent-blue-600"
            />
            Female
          </label>
        </div>
        <input
          type="text"
          name="phone"
          placeholder="Primary Phone Number"
          value={form.phone}
          onChange={handleInputChange}
          className="w-full mb-2 p-2 border rounded text-gray-900"
        />
        <input
          type="text"
          name="whatsapp"
          placeholder="WhatsApp Number"
          value={form.whatsapp}
          onChange={handleInputChange}
          className="w-full mb-2 p-2 border rounded text-gray-900"
        />
        {formError && <div className="text-red-500 mb-2">{formError}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={formLoading}
        >
          {formLoading ? "Adding..." : "Add Resident"}
        </button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : residents.length === 0 ? (
        <div>No residents found.</div>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border text-gray-900">Name</th>
              <th className="p-2 border text-gray-900">Gender</th>
              <th className="p-2 border text-gray-900">Primary Phone</th>
              <th className="p-2 border text-gray-900">WhatsApp</th>
              <th className="p-2 border text-gray-900">Created At</th>
              <th className="p-2 border text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {residents.map(resident => (
              <tr key={resident.id} className="border-b">
                {editingId === resident.id ? (
                  <>
                    <td className="p-2 border text-gray-900">
                      <input
                        type="text"
                        name="full_name"
                        value={editForm.full_name}
                        onChange={handleEditInputChange}
                        className="p-1 border rounded text-gray-900"
                      />
                    </td>
                    <td className="p-2 border text-gray-900">
                      <div className="flex gap-4 items-center">
                        <label className="flex items-center gap-1 text-gray-900">
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={editForm.gender === "Male"}
                            onChange={handleEditInputChange}
                            className="accent-blue-600"
                          />
                          Male
                        </label>
                        <label className="flex items-center gap-1 text-gray-900">
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={editForm.gender === "Female"}
                            onChange={handleEditInputChange}
                            className="accent-blue-600"
                          />
                          Female
                        </label>
                      </div>
                    </td>
                    <td className="p-2 border text-gray-900">
                      <input
                        type="text"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleEditInputChange}
                        className="p-1 border rounded text-gray-900"
                      />
                    </td>
                    <td className="p-2 border text-gray-900">
                      <input
                        type="text"
                        name="whatsapp"
                        value={editForm.whatsapp}
                        onChange={handleEditInputChange}
                        className="p-1 border rounded text-gray-900"
                      />
                    </td>
                    <td className="p-2 border text-gray-900">
                      <button
                        onClick={() => handleEditSave(resident.id)}
                        className="bg-green-600 text-white px-2 py-1 rounded mr-2"
                        disabled={editLoading}
                      >
                        Save
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                        disabled={editLoading}
                      >
                        Cancel
                      </button>
                      {editError && <div className="text-red-500 text-xs mt-1">{editError}</div>}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2 border text-gray-900">{resident.full_name}</td>
                    <td className="p-2 border text-gray-900">{resident.gender}</td>
                    <td className="p-2 border text-gray-900">{resident.phone}</td>
                    <td className="p-2 border text-gray-900">{resident.whatsapp}</td>
                    <td className="p-2 border text-gray-900">{new Date(resident.created_at).toLocaleString()}</td>
                    <td className="p-2 border text-gray-900">
                      <button
                        onClick={() => handleEditClick(resident)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(resident.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 