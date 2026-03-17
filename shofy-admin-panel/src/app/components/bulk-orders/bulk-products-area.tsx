"use client";
import React, { useState } from "react";
import ErrorMsg from "@/app/components/common/error-msg";
import {
  useGetBulkProductsAdminQuery,
  useCreateBulkProductMutation,
  useUpdateBulkProductMutation,
  useDeleteBulkProductMutation,
} from "@/redux/bulk-order/bulkOrderApi";
import { notifyError, notifySuccess } from "@/utils/toast";
import { Edit, Delete } from "@/svg";
import Swal from "sweetalert2";

const BulkProductsArea = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formActive, setFormActive] = useState(true);

  const { data: products = [], isError, isLoading, refetch } = useGetBulkProductsAdminQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateBulkProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateBulkProductMutation();
  const [deleteProduct] = useDeleteBulkProductMutation();

  const resetForm = () => {
    setEditingId(null);
    setFormName("");
    setFormDescription("");
    setFormActive(true);
    setShowForm(false);
  };

  const handleEdit = (p: { _id: string; name: string; description?: string; isActive?: boolean }) => {
    setEditingId(p._id);
    setFormName(p.name);
    setFormDescription(p.description || "");
    setFormActive(p.isActive !== false);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = formName.trim();
    if (!name) {
      notifyError("Product name is required");
      return;
    }
    try {
      if (editingId) {
        await updateProduct({
          id: editingId,
          name,
          description: formDescription,
          isActive: formActive,
        }).unwrap();
        notifySuccess("Bulk product updated");
      } else {
        await createProduct({ name, description: formDescription, isActive: formActive }).unwrap();
        notifySuccess("Bulk product created");
      }
      resetForm();
      refetch();
    } catch (e: any) {
      notifyError(e?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Delete bulk product?",
      text: `"${name}" will be removed from the list.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CF1B70",
      cancelButtonColor: "#6D6F71",
      confirmButtonText: "Yes, delete",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteProduct(id).unwrap();
      notifySuccess("Bulk product deleted");
      if (editingId === id) resetForm();
      refetch();
    } catch (e: any) {
      notifyError(e?.data?.message || "Failed to delete");
    }
  };

  let content: React.ReactNode = null;

  if (isLoading) {
    content = (
      <div className="py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-theme border-t-transparent" />
        <p className="mt-3 text-sm text-gray-500">Loading bulk products...</p>
      </div>
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="Failed to load bulk products" />;
  }
  if (!isLoading && !isError && products.length === 0 && !showForm) {
    content = (
      <div className="py-16 text-center">
        <p className="text-gray-500 mb-4">No bulk products yet. Add one to show on the Bulk Order form.</p>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="bg-theme text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90"
        >
          Add Bulk Product
        </button>
      </div>
    );
  }

  const isFormLoading = isCreating || isUpdating;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/30 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Bulk Products</h3>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-theme text-white font-semibold py-2 px-5 rounded-lg hover:opacity-90 transition-opacity"
        >
          {showForm ? "Cancel" : "Add Bulk Product"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-6 border-b border-gray-100 bg-gray-50/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme/20 focus:border-theme"
                placeholder="e.g. T-Shirts (Bulk)"
                required
              />
            </div>
            <div className="flex items-end gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="rounded border-gray-300 text-theme focus:ring-theme"
                />
                <span className="text-sm font-medium text-gray-700">Active (show on form)</span>
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description (optional)</label>
            <input
              type="text"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme/20 focus:border-theme"
              placeholder="Short description"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isFormLoading || !formName.trim()}
              className="bg-theme text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFormLoading ? "Saving..." : editingId ? "Update" : "Add Product"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {content}

      {!isLoading && !isError && (products.length > 0 || showForm) && products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p: any) => (
                <tr key={p._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{p.description || "—"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${
                        p.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(p)}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-theme/10 text-theme hover:bg-theme hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Edit />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p._id, p.name)}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                      title="Delete"
                    >
                      <Delete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BulkProductsArea;
