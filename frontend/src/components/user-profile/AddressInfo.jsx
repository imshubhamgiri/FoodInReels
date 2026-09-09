import { Plus, MapPin, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Addressbar from '../ui/Addressbar';
import AddressInput from '../ui/AddressInput';
import { useAppContext } from '../../context/AppContext';

const AddressInfo = () => {
  const { 
    addresses, 
    isLoadingAddresses, 
    fetchAddresses, 
    addAddress, 
    updateAddress, 
    deleteAddress 
  } = useAppContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAddAddress = async (newAddress) => {
    try {
      await addAddress(newAddress);
      toast.success('Address added successfully');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  };

  const handleUpdateAddress = async (updatedData) => {
    try {
      await updateAddress(editingAddress.id, updatedData);
      toast.success('Address updated successfully');
      setEditingAddress(null);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('Failed to update address');
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingAddress(null);
  };

  const handleDelete = async (addressId) => {
    try {
      await deleteAddress(addressId);
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const handleEditAddress = (addressData) => {
    setEditingAddress(addressData);
    setShowAddForm(true);
  };

  return (
    <div className="p-6 sm:p-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-b border-emerald-100 dark:border-slate-700 pb-4 mb-6 flex items-center justify-between">
          <span>Manage Addresses</span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {addresses.length} {addresses.length === 1 ? 'Address' : 'Addresses'}
          </span>
        </h2>
      </div>

      {showAddForm ? (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h3>
          <AddressInput
            initialData={editingAddress}
            onSave={editingAddress ? handleUpdateAddress : handleAddAddress}
            onCancel={handleCancelForm}
          />
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-sky-400/80 dark:border-sky-500/60 rounded-xl p-4 cursor-pointer hover:bg-sky-50/50 dark:hover:bg-slate-800/50 text-sky-600 dark:text-sky-400 transition-all mb-6 group"
          >
            <Plus size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold">Add New Address</span>
          </button>
        </div>
      )}

      {isLoadingAddresses && addresses.length === 0 ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <Addressbar
                key={address._id || address.id}
                id={address._id || address.id}
                label={address.label}
                fullName={address.fullName}
                address={address.address}
                phone={address.phone}
                locality={address.locality}
                city={address.city}
                state={address.state}
                postalCode={address.postalCode}
                country={address.country}
                landmark={address.landmark}
                isDefault={address.isDefault}
                className="hover:-translate-y-0.5 transition-transform duration-150 shadow-xs"
                onDelete={handleDelete}
                onEdit={handleEditAddress}
              />
            ))
          ) : (
            <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                <MapPin size={24} />
              </div>
              <p className="text-base font-semibold text-slate-800 dark:text-slate-200">No saved addresses</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                Save your home or work address for faster delivery checkout.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressInfo;
