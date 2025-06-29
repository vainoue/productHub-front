import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateUser, updateUserPhoto } from '../services/api';
import { 
  User, 
  ArrowLeft, 
  Mail, 
  Calendar, 
  Upload, 
  X,
  Loader2,
  Save,
  Camera,
  Eye
} from 'lucide-react';

export default function EditProfile() {
  const { user, updateUserContext } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const currentPhoto = user?.photo ? `data:image/*;base64,${user.photo}` : null;

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setBirthdate(user.birthdate ? user.birthdate.split('T')[0] : '');
    }
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setPhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const normalizedEmail = email.trim();

    if (!normalizedEmail && !birthdate && !photo) {
      toast.warn('Please fill at least one field to update');
      return;
    }

    // Validate email format if provided
    if (normalizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Update user data if email or birthdate changed
      if (normalizedEmail || birthdate) {
        const userUpdateData = {
          username: user.username,
          ...(normalizedEmail && { email: normalizedEmail }),
          ...(birthdate && { birthdate }),
        };
        
        await updateUser(userUpdateData);
        updateUserContext({
          ...user,
          ...(normalizedEmail && { email: normalizedEmail }),
          ...(birthdate && { birthdate }),
        });
      }

      // Update photo if provided
      if (photo) {
        const formData = new FormData();
        formData.append('userId', user.id.toString());
        formData.append('file', photo);

        await updateUserPhoto(formData);
        const base64Photo = await convertToBase64(photo);
        updateUserContext({ ...user, photo: base64Photo });
      }

      toast.success('Profile updated successfully!');
      navigate('/products');
    } catch (error) {
      toast.error('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/products')}
          className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-xl">
            <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update your personal information
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Profile Photo
            </label>
            
            <div className="flex items-center space-x-6">
              {/* Current/New Photo Display */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full overflow-hidden flex items-center justify-center">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="New profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : currentPhoto ? (
                    <img
                      src={currentPhoto}
                      alt="Current profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                
                {photoPreview && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <div className="space-y-3">
                  <label
                    htmlFor="photo-upload"
                    className="btn-secondary inline-flex items-center space-x-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{currentPhoto || photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
                  </label>
                  
                  {(currentPhoto || photoPreview) && (
                    <button
                      type="button"
                      onClick={() => setShowPreviewModal(true)}
                      className="btn-outline inline-flex items-center space-x-2 ml-3"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                  )}
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Birthdate */}
          <div>
            <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="birthdate"
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                disabled={loading}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* User Info Display */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Account Information
            </h3>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p><span className="font-medium">Username:</span> {user?.username}</p>
              <p><span className="font-medium">Member since:</span> {new Date().getFullYear()}</p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center space-x-2 flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/products')}
              disabled={loading}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (currentPhoto || photoPreview) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Profile Photo Preview
              </h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex justify-center mb-6">
              <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full overflow-hidden">
                <img
                  src={photoPreview || currentPhoto}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <button
              onClick={() => setShowPreviewModal(false)}
              className="btn-primary w-full"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}