"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import React, { useRef } from "react"; // Added for React.Fragment

interface Room {
  id: number;
  room_no: string;
  block: string;
  capacity: number;
  type: string;
}

interface Occupancy {
  id: number;
  room_id: number;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ room_no: "", block: "", capacity: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [occupancies, setOccupancies] = useState<Occupancy[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ room_no: "", block: "", capacity: "" });
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Add column resizing logic
  // Slightly larger defaults for better readability
  const defaultColWidths = [50, 110, 130, 90]; // Block, Room No, Occupancy, Actions
  const minWidths = [20, 20, 20, 20]; // All columns minimum 20px
  const [colWidths, setColWidths] = useState(defaultColWidths);
  const tableRef = useRef(null);

  const startResize = (colIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidths = [...colWidths];
    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidths = [...startWidths];
      newWidths[colIndex] = Math.max(minWidths[colIndex], startWidths[colIndex] + delta);
      setColWidths(newWidths);
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("rooms").select("*").order("room_no");
      if (error) {
        setError(error.message);
      } else {
        setRooms(data || []);
      }
      setLoading(false);
    };
    const fetchOccupancies = async () => {
      const { data } = await supabase.from("occupancies").select("id, room_id");
      setOccupancies(data || []);
    };
    fetchRooms();
    fetchOccupancies();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "block") {
      let newCapacity = form.capacity;
      if (value === "Old Block") newCapacity = "3";
      else if (value === "New Block") newCapacity = "2";
      else if (value === "Executive") newCapacity = "2";
      setForm({ ...form, block: value, capacity: newCapacity });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.room_no || !form.block || !form.capacity) {
      setFormError("All fields are required.");
      return;
    }
    if (isNaN(Number(form.capacity)) || Number(form.capacity) < 1) {
      setFormError("Capacity must be a positive number.");
      return;
    }
    setFormLoading(true);
    const { error } = await supabase.from("rooms").insert([
      { ...form, capacity: Number(form.capacity) }
    ]);
    setFormLoading(false);
    if (error) {
      setFormError(error.message);
    } else {
      setForm({ room_no: "", block: "", capacity: "" });
      // Refresh rooms list
      const { data } = await supabase.from("rooms").select("*").order("room_no");
      setRooms(data || []);
    }
  };

  const handleEditClick = (room: Room) => {
    setEditingId(room.id);
    setEditForm({
      room_no: room.room_no,
      block: room.block,
      capacity: String(room.capacity),
    });
    setEditError("");
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id: number) => {
    setEditLoading(true);
    setEditError("");
    if (!editForm.room_no || !editForm.block || !editForm.capacity) {
      setEditError("All fields are required.");
      setEditLoading(false);
      return;
    }
    if (isNaN(Number(editForm.capacity)) || Number(editForm.capacity) < 1) {
      setEditError("Capacity must be a positive number.");
      setEditLoading(false);
      return;
    }
    const { error } = await supabase.from("rooms").update({
      room_no: editForm.room_no,
      block: editForm.block,
      capacity: Number(editForm.capacity),
    }).eq("id", id);
    setEditLoading(false);
    if (error) {
      setEditError(error.message);
    } else {
      setEditingId(null);
      // Refresh rooms list
      const { data } = await supabase.from("rooms").select("*").order("room_no");
      setRooms(data || []);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditError("");
  };

  // Custom sort and group logic
  const oldBlockGroups = [
    { label: "Old Block – Ground Floor (G1–G5)", prefix: "G", start: 1, end: 5 },
    { label: "Old Block – First Floor (F1–F5)", prefix: "F", start: 1, end: 5 },
    { label: "Old Block – Second Floor (S1–S5)", prefix: "S", start: 1, end: 5 },
    { label: "Old Block – Third Floor (T1–T5)", prefix: "T", start: 1, end: 5 },
  ];
  const newBlockGroups = [
    { label: "New Block – First Floor (2F1–2F5)", prefix: "2F", start: 1, end: 5 },
    { label: "New Block – Second Floor (2S1–2S5)", prefix: "2S", start: 1, end: 5 },
    { label: "New Block – Third Floor (2T1–2T5)", prefix: "2T", start: 1, end: 5 },
    { label: "New Block – Left Wing (2L1–2L5)", prefix: "2L", start: 1, end: 5 },
  ];
  const executiveGroup = { label: "Executive (E1–E8)", prefix: "E", start: 1, end: 8 };

  function getRoomsByGroup(rooms: Room[], block: string, group: { label: string; prefix: string; start: number; end: number }) {
    return rooms.filter(
      (room) => {
        if (room.block !== block) return false;
        if (!room.room_no.startsWith(group.prefix)) return false;
        const num = parseInt(room.room_no.replace(group.prefix, ""));
        return num >= group.start && num <= group.end;
      }
    ).sort((a, b) => {
      const aNum = parseInt(a.room_no.replace(group.prefix, ""));
      const bNum = parseInt(b.room_no.replace(group.prefix, ""));
      return aNum - bNum;
    });
  }

  function getExecutiveRooms(rooms: Room[]) {
    return rooms.filter(
      (room) => {
        if (room.block !== "Executive") return false;
        if (!room.room_no.startsWith(executiveGroup.prefix)) return false;
        const num = parseInt(room.room_no.replace(executiveGroup.prefix, ""));
        return num >= executiveGroup.start && num <= executiveGroup.end;
      }
    ).sort((a, b) => {
      const aNum = parseInt(a.room_no.replace(executiveGroup.prefix, ""));
      const bNum = parseInt(b.room_no.replace(executiveGroup.prefix, ""));
      return aNum - bNum;
    });
  }

  // Add a mapping for floor labels for each group
  const oldBlockFloorLabels = [
    "Ground Floor",
    "First Floor",
    "Second Floor",
    "Third Floor",
  ];
  const newBlockFloorLabels = [
    "First Floor",
    "Second Floor",
    "Third Floor",
    "Last Floor",
  ];
  const executiveFloorLabels = ["Executive Building"];

  // Helper to render a room row (put this above the return statement)
  function renderRoomRow(room: Room) {
    const occupied = occupancies.filter(o => o.room_id === room.id).length;
    const empty = room.capacity - occupied;
    return (
      <tr key={room.id} className="border-b">
        {editingId === room.id ? (
          <>
            <td className="p-1 border text-gray-900 text-center">
              <input
                type="text"
                name="room_no"
                value={editForm.room_no}
                onChange={handleEditInputChange}
                className="p-1 border rounded text-gray-900"
              />
            </td>
            {/* Block dropdown restored in edit mode */}
            <td className="p-1 border text-gray-900 text-center">
              <select
                name="block"
                value={editForm.block}
                onChange={handleEditInputChange}
                className="p-1 border rounded text-gray-900"
              >
                <option value="Old Block">Old Block</option>
                <option value="New Block">New Block</option>
                <option value="Executive">Executive</option>
              </select>
            </td>
            {/* Capacity cell shown in edit mode */}
            <td className="p-1 border text-gray-900 text-center">
              <select
                name="capacity"
                value={editForm.capacity}
                onChange={handleEditInputChange}
                className="p-1 border rounded text-gray-900"
              >
                {editForm.block === "Executive" ? (
                  <>
                    <option value="2">2</option>
                    <option value="1">1</option>
                  </>
                ) : (
                  <>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>
                  </>
                )}
              </select>
            </td>
            <td className="p-1 border text-gray-900 text-center">
              {[...Array(Number(editForm.capacity))].map((_, i) => (
                <span
                  key={i}
                  className={`inline-block w-3 h-3 rounded-full mx-0.5 bg-red-400`}
                />
              ))}
            </td>
            <td className="p-1 border text-gray-900 text-center">
              <button
                onClick={() => handleEditSave(room.id)}
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
            <td className="p-1 border text-gray-900 text-center">{room.room_no}</td>
            {/* Capacity and Block cells hidden in view mode */}
            <td className="p-1 border text-gray-900 text-center">
              {[...Array(room.capacity)].map((_, i) => (
                <span
                  key={i}
                  className={`inline-block w-3 h-3 rounded-full mx-0.5 ${i < occupancies.filter(o => o.room_id === room.id).length ? "bg-green-500" : "bg-red-400"}`}
                />
              ))}
            </td>
            <td className="p-1 border text-gray-900 text-center">
              <button
                onClick={() => handleEditClick(room)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
            </td>
          </>
        )}
      </tr>
    );
  }

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Rooms Board</h1>
      {/* Add Room Button */}
      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={() => setShowAddModal(true)}
      >
        Add Room
      </button>
      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setShowAddModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-2">Add Room</h2>
            <form onSubmit={handleAddRoom}>
              <input
                type="text"
                name="room_no"
                placeholder="Room Number"
                value={form.room_no}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded text-gray-900"
              />
              <select
                name="block"
                value={form.block}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded text-gray-900"
              >
                <option value="">Select Block</option>
                <option value="Old Block">Old Block</option>
                <option value="New Block">New Block</option>
                <option value="Executive">Executive</option>
              </select>
              <select
                name="capacity"
                value={form.capacity}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border rounded text-gray-900"
              >
                <option value="">Select Capacity</option>
                {form.block === "Executive" ? (
                  <>
                    <option value="2">2</option>
                    <option value="1">1</option>
                  </>
                ) : form.block === "Old Block" || form.block === "New Block" ? (
                  <>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>
                  </>
                ) : null}
              </select>
              {formError && <div className="text-red-500 mb-2">{formError}</div>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => setShowAddModal(false)}
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  disabled={formLoading}
                >
                  {formLoading ? "Adding..." : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : rooms.length === 0 ? (
        <div>No rooms found.</div>
      ) : (
        <div className="overflow-x-auto mt-8">
          {/* Center the table horizontally */}
          <table ref={tableRef} className="w-auto border mx-auto" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: colWidths[0] }} />
              <col style={{ width: colWidths[1] }} />
              <col style={{ width: colWidths[2] }} />
              <col style={{ width: colWidths[3] }} />
            </colgroup>
            <thead>
              <tr className="bg-gray-200">
                <th className="p-1 border text-gray-900 w-8 text-center relative select-none" style={{ position: 'relative' }}>
                  Block
                  <span
                    className="absolute top-0 right-0 h-full w-2 cursor-col-resize z-10"
                    onMouseDown={(e) => startResize(0, e)}
                    style={{ userSelect: 'none' }}
                  />
                </th>
                <th className="p-1 border text-gray-900 relative select-none text-center" style={{ position: 'relative' }}>
                  Room No
                  <span
                    className="absolute top-0 right-0 h-full w-2 cursor-col-resize z-10"
                    onMouseDown={(e) => startResize(1, e)}
                    style={{ userSelect: 'none' }}
                  />
                </th>
                <th className="p-1 border text-gray-900 relative select-none text-center" style={{ position: 'relative' }}>
                  Occupancy
                  <span
                    className="absolute top-0 right-0 h-full w-2 cursor-col-resize z-10"
                    onMouseDown={(e) => startResize(2, e)}
                    style={{ userSelect: 'none' }}
                  />
                </th>
                <th className="p-1 border text-gray-900 relative select-none text-center" style={{ position: 'relative' }}>
                  Actions
                  <span
                    className="absolute top-0 right-0 h-full w-2 cursor-col-resize z-10"
                    onMouseDown={(e) => startResize(3, e)}
                    style={{ userSelect: 'none' }}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Old Block Groups with vertical label */}
              {(() => {
                let oldBlockRoomCount = oldBlockGroups.reduce((sum, group) => sum + getRoomsByGroup(rooms, "Old Block", group).length, 0);
                let oldBlockRendered = false;
                return oldBlockGroups.map((group, i) => {
                  const groupRooms = getRoomsByGroup(rooms, "Old Block", group);
                  if (groupRooms.length === 0) return null;
                  return (
                    <React.Fragment key={group.label}>
                      {/* Floor header */}
                      <tr>
                        {/* Only render the vertical block label for the first floor, with rowSpan for all rooms in Old Block */}
                        {!oldBlockRendered && (
                          <td
                            rowSpan={oldBlockRoomCount + oldBlockGroups.length}
                            className="bg-blue-100 font-bold text-blue-900 text-center align-middle"
                            style={{ writingMode: "vertical-rl", textOrientation: "mixed", fontSize: "0.9rem", letterSpacing: "0.05em", transform: "rotate(180deg)" }}
                          >
                            OLD BLOCK
                          </td>
                        )}
                        <td colSpan={3} className="bg-blue-50 font-semibold text-blue-900 p-2 text-center">{oldBlockFloorLabels[i]}</td>
                      </tr>
                      {groupRooms.map((room) => renderRoomRow(room))}
                      {oldBlockRendered = true}
                    </React.Fragment>
                  );
                });
              })()}
              {/* New Block Groups with vertical label */}
              {(() => {
                let newBlockRoomCount = newBlockGroups.reduce((sum, group) => sum + getRoomsByGroup(rooms, "New Block", group).length, 0);
                let newBlockRendered = false;
                return newBlockGroups.map((group, i) => {
                  const groupRooms = getRoomsByGroup(rooms, "New Block", group);
                  if (groupRooms.length === 0) return null;
                  return (
                    <React.Fragment key={group.label}>
                      <tr>
                        {!newBlockRendered && (
                          <td
                            rowSpan={newBlockRoomCount + newBlockGroups.length}
                            className="bg-green-100 font-bold text-green-900 text-center align-middle"
                            style={{ writingMode: "vertical-rl", textOrientation: "mixed", fontSize: "0.9rem", letterSpacing: "0.05em", transform: "rotate(180deg)" }}
                          >
                            NEW BLOCK
                          </td>
                        )}
                        <td colSpan={3} className="bg-green-50 font-semibold text-green-900 p-2 text-center">{newBlockFloorLabels[i]}</td>
                      </tr>
                      {groupRooms.map((room) => renderRoomRow(room))}
                      {newBlockRendered = true}
                    </React.Fragment>
                  );
                });
              })()}
              {/* Executive Group with vertical label */}
              {(() => {
                const execRooms = getExecutiveRooms(rooms);
                if (execRooms.length === 0) return null;
                return (
                  <React.Fragment key={executiveGroup.label}>
                    <tr>
                      <td
                        rowSpan={execRooms.length + 1}
                        className="bg-yellow-100 font-bold text-yellow-900 text-center align-middle"
                        style={{ writingMode: "vertical-rl", textOrientation: "mixed", fontSize: "0.9rem", letterSpacing: "0.05em", transform: "rotate(180deg)" }}
                      >
                        EXECUTIVE
                      </td>
                      <td colSpan={3} className="bg-yellow-50 font-semibold text-yellow-900 p-2 text-center">Executive Building</td>
                    </tr>
                    {execRooms.map((room) => renderRoomRow(room))}
                  </React.Fragment>
                );
              })()}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 